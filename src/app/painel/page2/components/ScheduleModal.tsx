import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Schedule } from '../hooks/useScheduleData';

const supabase = createClient();

interface Lead {
  nome_completo: string;
  chat_id: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  onScheduled: () => void;
}

export function ScheduleModal({ isOpen, onClose, schedule, onScheduled }: ScheduleModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const { data } = await supabase
        .from('leads')
        .select('nome_completo, chat_id')
        .ilike('nome_completo', `%${searchQuery}%`)
        .limit(5);

      return data || [];
    },
    enabled: searchQuery.length > 2
  });

  const handleSchedule = async () => {
    if (!selectedLead || !schedule) return;

    const { error } = await supabase
      .from('agendamentos')
      .update({
        disponivel: false,
        phone_number: selectedLead.chat_id
      })
      .eq('id', schedule.id);

    if (!error) {
      onScheduled();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Horário - {schedule?.horario.substring(0, 5)}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 w-4 h-4" />
            <Input
              placeholder="Buscar lead por nome..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedLead(null);
              }}
            />
          </div>

          {isLoading && (
            <div className="text-sm text-muted-foreground">
              Buscando leads...
            </div>
          )}

          {leads.length > 0 && (
            <div className="border rounded-md divide-y">
              {leads.map((lead) => (
                <div
                  key={lead.chat_id}
                  className={`p-2 cursor-pointer hover:bg-gray-50 ${
                    selectedLead?.chat_id === lead.chat_id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedLead(lead);
                    setSearchQuery(lead.nome_completo);
                  }}
                >
                  <div className="font-medium">{lead.nome_completo}</div>
                  <div className="text-sm text-gray-500">{lead.chat_id}</div>
                </div>
              ))}
            </div>
          )}

          {searchQuery && !isLoading && leads.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Nenhum lead encontrado
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSchedule}
            disabled={!selectedLead}
          >
            Agendar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
