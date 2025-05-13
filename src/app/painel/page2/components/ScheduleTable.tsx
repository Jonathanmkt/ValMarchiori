import React from 'react';
import { Schedule } from '../hooks/useScheduleData';
import { ScheduleTableHeader } from './ScheduleTableHeader';
import { ScheduleTableRow } from './ScheduleTableRow';

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

  return (
    <div className="relative h-full overflow-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <ScheduleTableHeader />
            <div className="bg-white divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <ScheduleTableRow
                  key={schedule.id}
                  schedule={schedule}
                  onSchedule={onSchedule}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
