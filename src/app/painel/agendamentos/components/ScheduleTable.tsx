import React from 'react';
import { Schedule } from '../hooks/useScheduleData';
import { ScheduleTableRow } from './ScheduleTableRow';
import { CalendarDays } from 'lucide-react';

interface ScheduleTableProps {
  schedules: Schedule[];
  isLoading: boolean;
  onSchedule: (schedule: Schedule) => void;
}

export function ScheduleTable({ schedules, isLoading, onSchedule }: ScheduleTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Se não houver horários, mostrar mensagem
  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg border border-gray-200 p-8 text-center">
        <CalendarDays className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Não há horários disponíveis para esse dia.
        </h3>
        <p className="text-gray-500">
          Por favor, selecione outra data ou entre em contato conosco.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full rounded-lg border border-gray-200 overflow-hidden bg-white">
      {/* Cabeçalho fixo */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="grid grid-cols-11 gap-4 font-medium text-gray-500 text-sm">
          <div className="col-span-2">Horário</div>
          <div className="col-span-4">Cliente</div>
          <div className="col-span-3">Serviço</div>
          <div className="col-span-2">Endereço</div>
        </div>
      </div>
      
      {/* Conteúdo rolável */}
      <div className="overflow-auto flex-1">
        <div className="min-w-full">
          <div className="divide-y divide-gray-100">
            {schedules.map((schedule) => (
              <ScheduleTableRow
                key={schedule.agendamento_id}
                schedule={schedule}
                onSchedule={onSchedule}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
