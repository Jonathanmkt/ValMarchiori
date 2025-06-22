import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useFetchAssociadosOptions } from '../hooks/useFetchAssociadosOptions';

interface NovoAssociadoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EnderecoForm {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

interface RgForm {
  numero: string;
  orgao_emissor: string;
  data_emissao: string;
}

interface AssociadoForm {
  nome_completo: string;
  cpf: string;
  matricula: string;
  telefone: string;
  email: string;
  data_nascimento: string;
  data_associacao: string;
  sexo: string;
  estado_civil: string;
  situacao: string;
  drt: string;
  observacao: string;
  endereco: EnderecoForm;
  rg_data: RgForm;
  inadimplente: boolean;
}

const initialFormState: AssociadoForm = {
  nome_completo: '',
  cpf: '',
  matricula: '',
  telefone: '',
  email: '',
  data_nascimento: '',
  data_associacao: new Date().toISOString().split('T')[0],
  sexo: 'nao_informado',
  estado_civil: '',
  situacao: 'pendente',
  drt: '',
  observacao: '',
  inadimplente: false,
  endereco: {
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: ''
  },
  rg_data: {
    numero: '',
    orgao_emissor: '',
    data_emissao: ''
  }
};

// Função para formatar o CPF com máscara
const formatCPF = (value: string) => {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 caracteres
  const cpf = numbers.slice(0, 11);
  
  // Aplica a máscara: 000.000.000-00
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  } else if (cpf.length <= 9) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  } else {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
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

// Função para normalizar o telefone (remover formatação)
const normalizeTelefone = (value: string) => {
  return value.replace(/\D/g, '');
};

export function NovoAssociadoModal({ isOpen, onClose }: NovoAssociadoModalProps) {
  const [form, setForm] = useState<AssociadoForm>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const supabase = createClient();
  
  // Hook para buscar opções do formulário
  const {
    estadoCivil,
    sexo,
    situacoes,
    estados,
    orgaosEmissores,
    loading: optionsLoading
  } = useFetchAssociadosOptions();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Campo aninhado (endereço ou RG)
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof AssociadoForm],
          [child]: value
        }
      }));
    } else if (name === 'cpf') {
      // Formata o CPF enquanto digita
      setForm(prev => ({
        ...prev,
        [name]: formatCPF(value)
      }));
    } else if (name === 'telefone') {
      // Formata o telefone enquanto digita
      setForm(prev => ({
        ...prev,
        [name]: formatTelefone(value)
      }));
    } else {
      // Campo normal
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handler para campos de select
  const handleSelectChange = (value: string, field: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Normaliza os dados
      const cpf = normalizeCPF(form.cpf);
      const telefone = normalizeTelefone(form.telefone);
      
      // Prepara os objetos aninhados
      const endereco = {
        logradouro: form.endereco.logradouro,
        numero: form.endereco.numero,
        complemento: form.endereco.complemento,
        bairro: form.endereco.bairro,
        cidade: form.endereco.cidade,
        uf: form.endereco.uf,
        cep: form.endereco.cep
      };

      const rg_data = {
        numero: form.rg_data.numero,
        orgao_emissor: form.rg_data.orgao_emissor,
        data_emissao: form.rg_data.data_emissao || null
      };

      // Insere o associado
      const { data: associadoData, error: associadoError } = await supabase
        .from('associados')
        .insert({
          nome_completo: form.nome_completo,
          cpf,
          matricula: form.matricula,
          telefone,
          email: form.email || null,
          data_nascimento: form.data_nascimento || null,
          data_associacao: form.data_associacao,
          sexo: form.sexo,
          estado_civil: form.estado_civil || null,
          situacao: form.situacao,
          drt: form.drt || null,
          observacao: form.observacao || null,
          endereco_data: endereco,
          rg_data: rg_data,
          inadimplente: form.inadimplente
        })
        .select('id')
        .single();

      if (associadoError) {
        throw new Error(associadoError.message);
      }

      // Atualiza os dados na interface
      queryClient.invalidateQueries({ queryKey: ['associados'] });
      
      toast.success('Associado cadastrado com sucesso!');
      setForm(initialFormState);
      onClose();
    } catch (error) {
      console.error('Erro ao cadastrar associado:', error);
      toast.error('Erro ao cadastrar associado. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Associado</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="matricula">Matrícula*</Label>
                <Input
                  id="matricula"
                  name="matricula"
                  value={form.matricula}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF*</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rg_data.numero">RG</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="rg_data.numero"
                    name="rg_data.numero"
                    value={form.rg_data.numero}
                    onChange={handleChange}
                    placeholder="Número"
                  />
                  <Select 
                    value={form.rg_data.orgao_emissor} 
                    onValueChange={(value) => handleSelectChange(value, 'rg_data.orgao_emissor')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Órgão Emissor" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgaosEmissores.map((orgao) => (
                        <SelectItem key={orgao.codigo} value={orgao.codigo || ''}>
                          {orgao.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone*</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  required
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
                <Label htmlFor="data_associacao">Data de Associação*</Label>
                <Input
                  id="data_associacao"
                  name="data_associacao"
                  type="date"
                  value={form.data_associacao}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select 
                  value={form.sexo} 
                  onValueChange={(value) => handleSelectChange(value, 'sexo')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {sexo.map((opcao) => (
                      <SelectItem key={opcao.id.toString()} value={opcao.id.toString()}>
                        {opcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado_civil">Estado Civil</Label>
                <Select 
                  value={form.estado_civil} 
                  onValueChange={(value) => handleSelectChange(value, 'estado_civil')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadoCivil.map((opcao) => (
                      <SelectItem key={opcao.id.toString()} value={opcao.id.toString()}>
                        {opcao.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drt">DRT (Registro Profissional)</Label>
                <Input
                  id="drt"
                  name="drt"
                  value={form.drt}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="situacao">Situação*</Label>
                <Select 
                  value={form.situacao} 
                  onValueChange={(value) => handleSelectChange(value, 'situacao')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Endereço */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-semibold">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco.logradouro">Logradouro</Label>
                <Input
                  id="endereco.logradouro"
                  name="endereco.logradouro"
                  value={form.endereco.logradouro}
                  onChange={handleChange}
                  placeholder="Rua, Avenida, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.numero">Número</Label>
                <Input
                  id="endereco.numero"
                  name="endereco.numero"
                  value={form.endereco.numero}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.complemento">Complemento</Label>
                <Input
                  id="endereco.complemento"
                  name="endereco.complemento"
                  value={form.endereco.complemento}
                  onChange={handleChange}
                  placeholder="Apto, Bloco, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.bairro">Bairro</Label>
                <Input
                  id="endereco.bairro"
                  name="endereco.bairro"
                  value={form.endereco.bairro}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.cidade">Cidade</Label>
                <Input
                  id="endereco.cidade"
                  name="endereco.cidade"
                  value={form.endereco.cidade}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.uf">UF</Label>
                <Select 
                  value={form.endereco.uf} 
                  onValueChange={(value) => handleSelectChange(value, 'endereco.uf')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem key={estado.codigo} value={estado.codigo || ''}>
                        {estado.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endereco.cep">CEP</Label>
                <Input
                  id="endereco.cep"
                  name="endereco.cep"
                  value={form.endereco.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>
          
          {/* Observações */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              rows={3}
              placeholder="Informações adicionais sobre o associado"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || optionsLoading}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
