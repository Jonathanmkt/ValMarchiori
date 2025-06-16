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
  cliente_uuid: string;
}

interface Service {
  servico_id: string;
  nome_servico: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: Schedule | null;
  onScheduled: () => void;
}

export function ScheduleModal({ isOpen, onClose, schedule, onScheduled }: ScheduleModalProps) {
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: leads = [], isLoading: isLoadingLeads } = useQuery({
    queryKey: ['leads', clientSearchQuery],
    queryFn: async () => {
      if (!clientSearchQuery) return [];
      
      const { data } = await supabase
        .from('clientes')
        .select('nome_completo, cliente_uuid')
        .ilike('nome_completo', `%${clientSearchQuery}%`)
        .limit(5);

      return data || [];
    },
    enabled: clientSearchQuery.length > 2
  });

  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['services', serviceSearchQuery],
    queryFn: async () => {
      if (!serviceSearchQuery) return [];
      
      const { data } = await supabase
        .from('servicos')
        .select('servico_id, nome_servico')
        .ilike('nome_servico', `%${serviceSearchQuery}%`)
        .limit(5);

      return data || [];
    },
    enabled: serviceSearchQuery.length > 2
  });

  // Função para agendar um horário
  const handleSchedule = async () => {
    if (!selectedLead || !selectedService || !schedule) return;

    // TODO: Este filial_uuid será dinamico no futuro quando tivermos mais filiais
    // Quando tivermos múltiplas filiais, este valor será obtido de um contexto ou seletor
    const filialUuid = '14911a2c-45a9-43c4-8ede-9dd5b02aa234';

    const { error } = await supabase
      .from('agendamentos')
      .update({
        disponivel: false,
        cliente: selectedLead.cliente_uuid,
        servico: selectedService.servico_id,
        filial: filialUuid
      })
      .eq('agendamento_id', schedule.agendamento_id);

    if (!error) {
      onScheduled();
      onClose();
    }
  };
  
  // Função para desmarcar um agendamento (usando useCallback para evitar recriação)
  const handleUnschedule = React.useCallback(async () => {
    if (!schedule) return;
    
    const { error } = await supabase
      .from('agendamentos')
      .update({
        disponivel: true,
        cliente: null,
        servico: null
      })
      .eq('agendamento_id', schedule.agendamento_id);

    if (!error) {
      onScheduled();
      onClose();
    }
  }, [schedule, onScheduled, onClose]);

  // Verificar se é uma desmarcação (se o agendamento já tem cliente)
  const isUnscheduling = schedule && !schedule.disponivel && schedule.cliente;

  // Se for uma desmarcação, executar a função de desmarcação apenas uma vez
  React.useEffect(() => {
    // Se o modal foi aberto para um agendamento existente (com cliente),
    // significa que é uma desmarcação
    if (isUnscheduling) {
      handleUnschedule();
    }
  }, [isUnscheduling, handleUnschedule]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isUnscheduling ? 'Desmarcar' : 'Agendar'} Horário - {schedule?.hora_agendamento.substring(0, 5)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Busca de Cliente */}
          <div>
            <label className="text-sm font-medium mb-2 block">Cliente</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 w-4 h-4" />
              <Input
                placeholder="Buscar cliente por nome..."
                className="pl-10"
                value={clientSearchQuery}
                onChange={(e) => {
                  setClientSearchQuery(e.target.value);
                  setSelectedLead(null);
                }}
              />
            </div>

            {isLoadingLeads && (
              <div className="text-sm text-muted-foreground mt-2">
                Buscando clientes...
              </div>
            )}

            {leads.length > 0 && (
              <div className="border rounded-md divide-y mt-2">
                {leads.map((lead) => (
                  <div
                    key={lead.cliente_uuid}
                    className={`p-2 cursor-pointer hover:bg-gray-50 ${
                      selectedLead?.cliente_uuid === lead.cliente_uuid ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedLead(lead);
                      setClientSearchQuery(lead.nome_completo);
                    }}
                  >
                    <div className="font-medium">{lead.nome_completo}</div>
                    <div className="text-sm text-gray-500">ID: {lead.cliente_uuid}</div>
                  </div>
                ))}
              </div>
            )}

            {clientSearchQuery && !isLoadingLeads && leads.length === 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                Nenhum cliente encontrado
              </div>
            )}
          </div>

          {/* Busca de Serviço */}
          <div>
            <label className="text-sm font-medium mb-2 block">Serviço</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/70 w-4 h-4" />
              <Input
                placeholder="Buscar serviço..."
                className="pl-10"
                value={serviceSearchQuery}
                onChange={(e) => {
                  setServiceSearchQuery(e.target.value);
                  setSelectedService(null);
                }}
              />
            </div>

            {isLoadingServices && (
              <div className="text-sm text-muted-foreground mt-2">
                Buscando serviços...
              </div>
            )}

            {services.length > 0 && (
              <div className="border rounded-md divide-y mt-2">
                {services.map((service) => (
                  <div
                    key={service.servico_id}
                    className={`p-2 cursor-pointer hover:bg-gray-50 ${
                      selectedService?.servico_id === service.servico_id ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedService(service);
                      setServiceSearchQuery(service.nome_servico);
                    }}
                  >
                    <div className="font-medium">{service.nome_servico}</div>
                  </div>
                ))}
              </div>
            )}

            {serviceSearchQuery && !isLoadingServices && services.length === 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                Nenhum serviço encontrado
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSchedule}
            disabled={!selectedLead || !selectedService}
          >
            Agendar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
