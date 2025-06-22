import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { NovoAssociado, EnderecoData, RgData } from '../types/associados-types';

interface NovoAssociadoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AssociadoForm {
  nome_completo: string;
  cpf: string;
  matricula: string; // Será convertido para número
  telefone: string;
  email: string;
  sexo: string;
  data_nascimento: string;
  endereco: EnderecoData;
  rg_numero: string;
  rg_orgao_emissor: string;
  observacao: string;
}

const initialFormState: AssociadoForm = {
  nome_completo: '',
  cpf: '',
  matricula: '',
  telefone: '',
  email: '',
  sexo: '',
  data_nascimento: '',
  endereco: {
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: ''
  },
  rg_numero: '',
  rg_orgao_emissor: '',
  observacao: ''
};

// Função para formatar o CPF
const formatCPF = (value: string) => {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara de CPF
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  }
};

// Função para formatar o telefone com máscara
const formatTelefone = (value: string) => {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara conforme o tamanho do número
  if (numbers.length <= 2) {
    return `(${numbers}`;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

// Função para normalizar o CPF (remover formatação)
const normalizeCPF = (value: string) => {
  return value.replace(/\D/g, '');
};

export function NovoAssociadoModal({ isOpen, onClose }: NovoAssociadoModalProps) {
  const [form, setForm] = useState<AssociadoForm>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Campo de endereço
      const [parent, child] = name.split('.');
      if (parent === 'endereco') {
        setForm(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            [child]: value
          }
        }));
      }
    } else if (name === 'telefone') {
      // Formata o telefone enquanto digita
      setForm(prev => ({
        ...prev,
        [name]: formatTelefone(value)
      }));
    } else if (name === 'cpf') {
      // Formata o CPF enquanto digita
      setForm(prev => ({
        ...prev,
        [name]: formatCPF(value)
      }));
    } else {
      // Campo normal
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepara o objeto de RG
      const rg_data: RgData = {
        numero: form.rg_numero,
        orgao_emissor: form.rg_orgao_emissor
      };

      // Obtém o próximo DRT (usando um valor temporário aqui)
      // Na implementação real, isso seria obtido do banco de dados ou via API
      const proximoDrt = 10000; // Temporário
      
      // Insere o associado na tabela associados
      const { error } = await supabase
        .from('associados')
        .insert({
          nome_completo: form.nome_completo,
          cpf: normalizeCPF(form.cpf),
          matricula: parseInt(form.matricula, 10),
          drt: proximoDrt,
          telefone: form.telefone || null,
          email: form.email || null,
          sexo: form.sexo || null,
          data_nascimento: form.data_nascimento || null,
          rg_data: rg_data,
          endereco_data: form.endereco,
          observacao: form.observacao || null
        });

      if (error) {
        throw new Error(error.message);
      }

      // Atualiza os dados na interface
      queryClient.invalidateQueries({ queryKey: ['associados'] });
      
      toast.success('Associado cadastrado com sucesso!');
      setForm(initialFormState);
      onClose();
    } catch (error) {
      // Exibe mensagem de erro para o usuário
      toast.error('Erro ao cadastrar associado. Por favor, tente novamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Associado</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados básicos */}
          <div className="space-y-2">
            <Label htmlFor="nome_completo">Nome Completo*</Label>
            <Input
              id="nome_completo"
              name="nome_completo"
              value={form.nome_completo}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* CPF e Matrícula */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF*</Label>
              <Input
                id="cpf"
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula*</Label>
              <Input
                id="matricula"
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
                type="number"
                required
              />
            </div>
          </div>
          
          {/* Contato */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Data de nascimento e sexo */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                name="data_nascimento"
                type="date"
                value={form.data_nascimento}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Input
                id="sexo"
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                placeholder="M, F ou Outro"
              />
            </div>
          </div>
          
          {/* Documento RG */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="rg_numero">RG*</Label>
              <Input
                id="rg_numero"
                name="rg_numero"
                value={form.rg_numero}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rg_orgao_emissor">Órgão Emissor*</Label>
              <Input
                id="rg_orgao_emissor"
                name="rg_orgao_emissor"
                value={form.rg_orgao_emissor}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          {/* Endereço */}
          <div className="space-y-2">
            <Label>Endereço</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <Input
                  name="endereco.logradouro"
                  placeholder="Logradouro"
                  value={form.endereco.logradouro}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  name="endereco.numero"
                  placeholder="Número"
                  value={form.endereco.numero}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  name="endereco.complemento"
                  placeholder="Complemento"
                  value={form.endereco.complemento}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  name="endereco.bairro"
                  placeholder="Bairro"
                  value={form.endereco.bairro}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  name="endereco.cidade"
                  placeholder="Cidade"
                  value={form.endereco.cidade}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  name="endereco.uf"
                  placeholder="UF"
                  value={form.endereco.uf}
                  onChange={handleChange}
                  maxLength={2}
                />
              </div>
              <div className="col-span-2">
                <Input
                  name="endereco.cep"
                  placeholder="CEP"
                  value={form.endereco.cep}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
