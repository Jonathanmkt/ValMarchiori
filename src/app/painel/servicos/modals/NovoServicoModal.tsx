import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface NovoServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServicoForm {
  nome_servico: string;
  servico_code: string;
  tipo_do_servico: string;
}

const initialFormState: ServicoForm = {
  nome_servico: '',
  servico_code: '',
  tipo_do_servico: ''
};

// Constante com o ID da filial para teste
const FILIAL_UUID = '14911a2c-45a9-43c4-8ede-9dd5b02aa234';

export function NovoServicoModal({ isOpen, onClose }: NovoServicoModalProps) {
  const [form, setForm] = useState<ServicoForm>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Criar o serviço com todos os campos obrigatórios
      const { data: servicoData, error: servicoError } = await supabase
        .from('servicos')
        .insert([
          {
            nome_servico: form.nome_servico,
            servico_code: form.servico_code,
            tipo_do_servico: form.tipo_do_servico || null,
            filial_id: FILIAL_UUID,  // Campo obrigatório
            disponivel: true,         // Campo obrigatório
            valor: 0,                 // Valor padrão para teste
            duracao_minutos: 60,      // Valor padrão
            disponivel_delivery: false,
            necessita_preparo: false
          }
        ])
        .select();
      
      if (servicoError) {
        throw servicoError;
      }
      
      if (!servicoData || servicoData.length === 0) {
        throw new Error('Não foi possível obter o ID do serviço criado');
      }
      
      const servico_id = servicoData[0].servico_id;
      
      // 2. Criar a relação com a filial na tabela filiais_servicos
      const { error: filialError } = await supabase
        .from('filiais_servicos')
        .insert([
          {
            filial_uuid: FILIAL_UUID,
            servico_id: servico_id,
            ativo: true
          }
        ]);
      
      if (filialError) {
        throw filialError;
      }
      
      // Invalidar queries para recarregar os dados
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      
      toast.success('Serviço cadastrado com sucesso!');
      setForm(initialFormState);
      onClose();
    } catch (error) {
      toast.error(`Erro ao cadastrar serviço: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Por favor, tente novamente.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Cadastrar Novo Serviço</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nome_servico">Nome do Serviço</Label>
            <Input
              id="nome_servico"
              name="nome_servico"
              value={form.nome_servico}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="servico_code">Código do Serviço</Label>
            <Input
              id="servico_code"
              name="servico_code"
              value={form.servico_code}
              onChange={handleChange}
              placeholder="Ex: SERV001"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipo_do_servico">Tipo do Serviço</Label>
            <Input
              id="tipo_do_servico"
              name="tipo_do_servico"
              value={form.tipo_do_servico}
              onChange={handleChange}
              placeholder="Ex: Estética, Massagem, Tratamento"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
