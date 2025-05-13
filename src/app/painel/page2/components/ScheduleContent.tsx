import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Schedule, useScheduleData } from '../hooks/useScheduleData';
import { ScheduleModal } from './ScheduleModal';
import { ScheduleTable } from './ScheduleTable';

export function ScheduleContent() {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const {
    schedules,
    isLoading,
    currentDate,
    goToPreviousDay,
    goToNextDay
  } = useScheduleData();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Agendamentos</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousDay}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-lg font-medium capitalize">
              {currentDate}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextDay}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full relative">
          <ScheduleTable 
            schedules={schedules}
            isLoading={isLoading}
            onSchedule={setSelectedSchedule}
          />

          <ScheduleModal
            isOpen={!!selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
            schedule={selectedSchedule}
            onScheduled={() => {
              setSelectedSchedule(null);
              // Recarregar os dados
              window.location.reload();
            }}
          />
        </div>
      </div>
    </div>
  );
}
