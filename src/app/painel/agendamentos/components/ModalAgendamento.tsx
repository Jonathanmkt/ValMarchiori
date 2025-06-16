import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const supabaseClient = createClient();

interface Cliente {
  cliente_id: string;
  nome_completo: string;
}

interface Servico {
  servico_id: string;
  nome_servico: string;
}

interface ModalAgendamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (clienteId: string, servicoId: string) => void;
  horario: string;
}

export function ModalAgendamento({ isOpen, onClose, onConfirm, horario }: ModalAgendamentoProps) {
  const [searchCliente, setSearchCliente] = useState('');
  const [searchServico, setSearchServico] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingServicos, setLoadingServicos] = useState(false);

  // Busca clientes quando o termo de busca muda
  useEffect(() => {
    if (searchCliente.length >= 2) {
      buscarClientes();
    } else {
      setClientes([]);
    }
  }, [searchCliente]);

  // Busca serviços quando o termo de busca muda
  useEffect(() => {
    if (searchServico.length >= 2) {
      buscarServicos();
    } else {
      setServicos([]);
    }
  }, [searchServico]);

  const buscarClientes = async () => {
    setLoadingClientes(true);
    try {
      const { data, error } = await supabaseClient
        .from('clientes')
        .select('cliente_id, nome_completo')
        .ilike('nome_completo', `%${searchCliente}%`)
        .limit(10);

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        return;
      }

      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const buscarServicos = async () => {
    setLoadingServicos(true);
    try {
      const { data, error } = await supabaseClient
        .from('servicos')
        .select('servico_id, nome_servico')
        .ilike('nome_servico', `%${searchServico}%`)
        .limit(10);

      if (error) {
        console.error('Erro ao buscar serviços:', error);
        return;
      }

      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoadingServicos(false);
    }
  };

  const handleConfirmar = () => {
    if (clienteSelecionado && servicoSelecionado) {
      onConfirm(clienteSelecionado.cliente_id, servicoSelecionado.servico_id);
      handleClose();
    }
  };

  const handleClose = () => {
    setSearchCliente('');
    setSearchServico('');
    setClientes([]);
    setServicos([]);
    setClienteSelecionado(null);
    setServicoSelecionado(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Agendar Horário - {horario}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Busca de Cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchCliente}
                onChange={(e) => setSearchCliente(e.target.value)}
                placeholder="Digite o nome do cliente..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Lista de clientes */}
            {loadingClientes && (
              <div className="mt-2 text-sm text-gray-500">Buscando clientes...</div>
            )}
            {clientes.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                {clientes.map((cliente) => (
                  <button
                    key={cliente.cliente_id}
                    onClick={() => {
                      setClienteSelecionado(cliente);
                      setSearchCliente(cliente.nome_completo);
                      setClientes([]);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    {cliente.nome_completo}
                  </button>
                ))}
              </div>
            )}
            
            {/* Cliente selecionado */}
            {clienteSelecionado && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                ✓ {clienteSelecionado.nome_completo}
              </div>
            )}
          </div>

          {/* Busca de Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serviço
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchServico}
                onChange={(e) => setSearchServico(e.target.value)}
                placeholder="Digite o nome do serviço..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Lista de serviços */}
            {loadingServicos && (
              <div className="mt-2 text-sm text-gray-500">Buscando serviços...</div>
            )}
            {servicos.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                {servicos.map((servico) => (
                  <button
                    key={servico.servico_id}
                    onClick={() => {
                      setServicoSelecionado(servico);
                      setSearchServico(servico.nome_servico);
                      setServicos([]);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    {servico.nome_servico}
                  </button>
                ))}
              </div>
            )}
            
            {/* Serviço selecionado */}
            {servicoSelecionado && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                ✓ {servicoSelecionado.nome_servico}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!clienteSelecionado || !servicoSelecionado}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
}
