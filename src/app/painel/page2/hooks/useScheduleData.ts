import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const supabaseClient = createClient();

export interface Schedule {
  id: number;
  dia_semana: string;
  data: string;
  horario: string;
  turno: string;
  disponivel: boolean;
  phone_number: string | null;
  nome_completo: string | null;
  chat_id: string | null;
}

export function useScheduleData() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['schedules', format(currentDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from('agendamentos')
        .select('*')
        .eq('data', format(currentDate, 'yyyy-MM-dd'))
        .order('horario');

      if (error) throw error;

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        return [];
      }

      // Buscar leads para os agendamentos não disponíveis
      const phonesToFetch = data
        .filter(item => !item.disponivel)
        .map(item => item.phone_number);

      if (phonesToFetch.length > 0) {
        const { data: leadsData } = await supabaseClient
          .from('leads')
          .select('nome_completo, chat_id')
          .in('chat_id', phonesToFetch);

        const leadsMap = new Map(
          leadsData?.map(lead => [lead.chat_id, lead]) || []
        );

        return data.map(item => ({
          ...item,
          nome_completo: !item.disponivel ? leadsMap.get(item.phone_number)?.nome_completo || 'Lead não encontrado' : 'Horário Disponível',
          leads: undefined
        })) as Schedule[];
      }

      return data.map(item => ({
        ...item,
        nome_completo: 'Horário Disponível',
        leads: undefined
      })) as Schedule[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const goToPreviousDay = () => {
    setCurrentDate(prev => subDays(prev, 1));
  };

  const goToNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };

  const formattedDate = format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });

  return {
    schedules,
    isLoading,
    currentDate: formattedDate,
    goToPreviousDay,
    goToNextDay
  };
}
