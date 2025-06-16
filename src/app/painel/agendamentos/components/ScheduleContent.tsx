'use client';

import React, { useState, useCallback } from "react";
import { Schedule, useScheduleData } from '../hooks/useScheduleData';
import { ScheduleModal } from './ScheduleModal';
import { ScheduleTable } from './ScheduleTable';
import { DatePicker } from "@/components/ui/date-picker";

export function ScheduleContent() {
  const [date, setDate] = React.useState<Date>(new Date())
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const { schedules, isLoading } = useScheduleData({ date });

  const handleSchedule = useCallback((schedule: Schedule) => {
    setSelectedSchedule(schedule);
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className='h-full flex flex-col bg-gray-200 rounded-lg shadow'>
        {/* Header com DatePicker e contador - fixo no topo */}
        <div className='shrink-0 p-6 pb-0'>
          <div className='flex justify-between items-center'>
            <div className="flex items-center gap-4">
              <DatePicker value={date} onChange={setDate} />
            </div>
            <div className='text-sm text-gray-900'>
              {isLoading ? 'Carregando...' : `Total de horários: ${schedules.length}`}
            </div>
          </div>
        </div>
        
        {/* Tabela de agendamentos */}
        <div className="flex-1 p-6 pt-4 overflow-hidden">
          <ScheduleTable 
            schedules={schedules} 
            isLoading={isLoading}
            onSchedule={handleSchedule}
          />
        </div>

        {selectedSchedule && (
          <ScheduleModal
            isOpen={!!selectedSchedule}
            schedule={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
            onScheduled={() => {
              setSelectedSchedule(null);
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
}
