
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, Plus, Filter } from 'lucide-react';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30'
  ];

  const appointments = [
    { id: 1, time: '09:00', client: 'Maria Silva', service: 'Corte + Escova', professional: 'Ana', status: 'confirmado' },
    { id: 2, time: '10:30', client: 'João Santos', service: 'Barba', professional: 'Carlos', status: 'pendente' },
    { id: 3, time: '14:00', client: 'Ana Costa', service: 'Manicure', professional: 'Lucia', status: 'confirmado' },
    { id: 4, time: '15:30', client: 'Carlos Lima', service: 'Corte', professional: 'Ana', status: 'cancelado' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie todos os agendamentos</p>
        </div>
        <Button className="bg-primary hover:bg-secondary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border w-full"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Agendamentos hoje:</span>
                  <Badge variant="secondary">4</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Disponível:</span>
                  <Badge className="bg-green-100 text-green-800">18 slots</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  Horários - {selectedDate ? formatDate(selectedDate) : 'Selecione uma data'}
                </CardTitle>
                <CardDescription>Clique em um horário para criar novo agendamento</CardDescription>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timeSlots.map((time) => {
                const appointment = appointments.find(apt => apt.time === time);
                
                return (
                  <div key={time} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-16 text-sm font-medium text-muted-foreground">
                      {time}
                    </div>
                    
                    {appointment ? (
                      <div className={`flex-1 p-3 rounded border-2 ${getStatusColor(appointment.status)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{appointment.client}</p>
                            <p className="text-sm opacity-80">{appointment.service}</p>
                            <p className="text-xs opacity-70">com {appointment.professional}</p>
                          </div>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 p-3 border-2 border-dashed border-muted rounded cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                        <p className="text-sm text-muted-foreground text-center">
                          Horário disponível - Clique para agendar
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Appointments;
