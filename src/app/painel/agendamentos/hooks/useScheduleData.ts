import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const supabaseClient = createClient();

interface ClienteInfo {
  nome_completo: string;
  endereco: {
    logradouro?: string;
    numero?: string | number;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
    complemento?: string;
    referencia?: string;
  };
}

export interface Schedule {
  agendamento_id: string;
  hora_agendamento: string;
  disponivel: boolean;
  cliente: string | null;
  clientes: ClienteInfo | null;
  servicos: {
    nome_servico: string;
  } | null;
}

interface UseScheduleDataProps {
  date?: Date;
}

export function useScheduleData({ date = new Date() }: UseScheduleDataProps = {}) {
  const [currentDate, setCurrentDate] = useState(date);

  const queryClient = useQueryClient();
  
  // Efeito para atualização automática a cada segundo
  // PARA REMOVER: Este bloco de useEffect pode ser removido quando não for mais necessário
  // a atualização automática
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['schedules', format(currentDate, 'yyyy-MM-dd')] 
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentDate, queryClient]);

  const { 
    data: schedules = [], 
    isLoading, 
    dataUpdatedAt
  } = useQuery({
    queryKey: ['schedules', format(currentDate, 'yyyy-MM-dd')],
    // Configurações para melhorar a experiência durante atualizações frequentes
    refetchOnWindowFocus: false, // Evita recarregar quando a janela ganha foco
    // Mantém os dados anteriores enquanto carrega os novos
    // @ts-expect-error - keepPreviousData não está na tipagem mas é suportado
    keepPreviousData: true,
    // Tempo em que os dados são considerados válidos (em ms)
    staleTime: 1000 * 60 * 5, // 5 minutos
    // Tempo em que os dados em cache são considerados válidos (em ms)
    cacheTime: 5 * 60 * 1000, // 5 minutos
    queryFn: async (): Promise<Schedule[]> => {
      // Consulta os agendamentos com seus relacionamentos
      const { data, error } = await supabaseClient
        .from('agendamentos')
        .select(`
          agendamento_id,
          hora_agendamento,
          disponivel,
          cliente,
          clientes:cliente (nome_completo, endereco),
          servicos:servico (nome_servico)
        `)
        .eq('data_agendamento', format(currentDate, 'yyyy-MM-dd'))
        .order('hora_agendamento');

      if (error) {
        // eslint-disable-next-line no-console
        console.error('Erro ao buscar agendamentos:', error);
        return [];
      }

      // Mapeia os dados para o formato esperado
      if (!data) return [];
      
      // Log para depuração dos dados retornados
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('Dados retornados pela consulta:', JSON.stringify(data, null, 2));
      }
      
      // Definição de tipos para os dados retornados pelo Supabase
      interface ClienteData {
        nome_completo?: string;
        endereco?: Record<string, unknown>;
      }
      
      interface ServicoData {
        nome_servico?: string;
      }
      
      // Tipagem para acomodar diferentes formatos de retorno do Supabase
      type RawAgendamentoData = {
        agendamento_id: string;
        hora_agendamento: string;
        disponivel: boolean;
        cliente: string | null;
        clientes: ClienteData | ClienteData[] | null | undefined;
        servicos: ServicoData | ServicoData[] | null | undefined;
      };
      
      return data.map((item: RawAgendamentoData) => {
        // Log para depuração dos dados do item específico
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.debug('Dados do item:', JSON.stringify(item, null, 2));
        }
        
        // Extrai os dados do cliente e serviço, tratando diferentes formatos de retorno
        let clienteInfo = null;
        if (item.clientes) {
          // Verifica se é um array ou objeto direto
          if (Array.isArray(item.clientes)) {
            clienteInfo = item.clientes.length > 0 ? item.clientes[0] : null;
          } else {
            clienteInfo = item.clientes;
          }
        }
        
        let servicoInfo = null;
        if (item.servicos) {
          // Verifica se é um array ou objeto direto
          if (Array.isArray(item.servicos)) {
            servicoInfo = item.servicos.length > 0 ? item.servicos[0] : null;
          } else {
            servicoInfo = item.servicos;
          }
        }
        
        // Log dos dados extraídos
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.debug('Cliente:', clienteInfo, 'Serviço:', servicoInfo);
        }
        
        return {
          agendamento_id: item.agendamento_id,
          hora_agendamento: item.hora_agendamento,
          disponivel: item.disponivel,
          cliente: item.cliente,
          clientes: clienteInfo ? {
            nome_completo: clienteInfo.nome_completo || 'Cliente não informado',
            endereco: typeof clienteInfo.endereco === 'object' ? clienteInfo.endereco : {}
          } : null,
          servicos: servicoInfo ? {
            nome_servico: servicoInfo.nome_servico || 'Serviço não especificado'
          } : null
        };
      });
    }
  });

  // Atualiza a data quando a prop date mudar
  React.useEffect(() => {
    if (date) {
      setCurrentDate(date);
    }
  }, [date]);
  
  // Efeito para atualização automática a cada segundo
  // =================================================
  // ATENÇÃO: Este bloco de código deve ser removido quando não for mais necessário
  // a atualização automática a cada segundo. Para remover, basta remover este
  // bloco de useEffect inteiro.
  // =================================================
  React.useEffect(() => {
    // Debug apenas em desenvolvimento
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('Atualizando agendamentos...');
    }
    
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['schedules', format(currentDate, 'yyyy-MM-dd')] 
      });
    }, 1000);
    
    return () => {
      clearInterval(interval);
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('Limpeza do intervalo de atualização automática');
      }
    };
  }, [currentDate, queryClient]);
  // =================================================
  // FIM DO BLOCO DE ATUALIZAÇÃO AUTOMÁTICA
  // =================================================

  const goToPreviousDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
  };

  const goToNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };

  return {
    schedules: Array.isArray(schedules) ? schedules : [],
    isLoading,
    currentDate: format(currentDate, 'PPP', { locale: ptBR }),
    currentDateObj: currentDate,
    goToPreviousDay,
    goToNextDay,
    totalCount: Array.isArray(schedules) ? schedules.length : 0,
    lastUpdated: Array.isArray(schedules) && schedules.length > 0 ? dataUpdatedAt : null
  };
}
