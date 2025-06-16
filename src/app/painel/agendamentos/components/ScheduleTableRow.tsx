import React, { useState } from 'react';
import { Schedule } from '../hooks/useScheduleData';
import { Search, CalendarPlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Endereco {
  logradouro?: string;
  numero?: string | number;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  complemento?: string;
  referencia?: string;
  // Adicione aqui outros campos que possam existir no endereço
}

interface ScheduleTableRowProps {
  schedule: Schedule;
  onSchedule: (schedule: Schedule) => void;
}

export function ScheduleTableRow({ schedule, onSchedule }: ScheduleTableRowProps) {
  // Formata o horário para exibição (HH:MM)
  const formattedTime = schedule.hora_agendamento.substring(0, 5);

  // Função para formatar o endereço completo (para tooltip)
  const formatarEnderecoCompleto = (endereco: Endereco | undefined) => {
    if (!endereco) return 'Endereço não informado';
    
    const { logradouro, numero, bairro, cidade, uf, cep, complemento, referencia } = endereco;
    const partes = [];
    
    if (logradouro) partes.push(logradouro);
    if (numero) partes.push(numero);
    if (bairro) partes.push(bairro);
    if (cidade) partes.push(cidade);
    if (uf) partes.push(uf);
    if (cep) partes.push(`CEP: ${cep}`);
    if (complemento) partes.push(`Complemento: ${complemento}`);
    if (referencia) partes.push(`Referência: ${referencia}`);
    
    return partes.join(', ');
  };

  // Função para formatar endereço resumido (apenas rua e número)
  const formatarEnderecoResumido = (endereco: Endereco | undefined) => {
    if (!endereco) return 'Não informado';
    
    const { logradouro, numero } = endereco;
    const partes = [];
    
    if (logradouro) {
      // Capitaliza a primeira letra da rua
      const ruaCapitalizada = logradouro.charAt(0).toUpperCase() + logradouro.slice(1).toLowerCase();
      partes.push(ruaCapitalizada);
    }
    if (numero) partes.push(numero);
    
    return partes.length > 0 ? partes.join(', ') : 'Não informado';
  };

  const [showUnscheduleDialog, setShowUnscheduleDialog] = useState(false);

  const handleScheduleClick = () => {
    if (schedule.disponivel) {
      onSchedule(schedule);
    } else {
      setShowUnscheduleDialog(true);
    }
  };

  // Quando confirmar a desmarcação, fechar o diálogo e chamar a função de desmarcação
  const handleUnschedule = () => {
    // Fechamos o diálogo
    setShowUnscheduleDialog(false);
    
    // Chamamos a função de desmarcação no componente pai
    // O componente pai (ScheduleContent) vai abrir o modal com o agendamento selecionado
    // e o modal vai detectar que é uma desmarcação
    onSchedule(schedule);
  };

  return (
    <div 
      className={cn(
        'grid grid-cols-11 gap-4 items-center p-4 border-b border-gray-100',
        'cursor-pointer transition-colors',
        schedule.disponivel 
          ? 'bg-gray-50 hover:bg-gray-100' 
          : 'bg-white hover:bg-gray-50',
        'group'
      )}
      onClick={handleScheduleClick}
    >
      {/* Coluna do Horário */}
      <div className="col-span-2">
        <span className="font-medium text-gray-900">{formattedTime}</span>
      </div>

      {/* Coluna do Cliente */}
      <div className="col-span-4">
        {schedule.disponivel ? (
          <div className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-gray-400 group-hover:text-primary" />
          </div>
        ) : (
          <span className="text-gray-900">{schedule.clientes?.nome_completo || 'Cliente não informado'}</span>
        )}
      </div>
      
      {/* Coluna do Serviço */}
      <div className="col-span-3">
        {schedule.disponivel ? (
          <span className="text-gray-500">-</span>
        ) : (
          <span className="text-gray-900">{schedule.servicos?.nome_servico || 'Serviço não especificado'}</span>
        )}
      </div>
      
      {/* Coluna do Endereço */}
      <div className="col-span-2">
        {schedule.disponivel ? (
          <span className="text-gray-500">-</span>
        ) : (
          <div className="flex items-center gap-2">
            {schedule.clientes?.endereco ? (
              <div className="flex items-center relative">
                <span 
                  className="text-gray-900 cursor-help hover:text-primary inline-block"
                  onMouseEnter={(e) => {
                    const tooltip = document.getElementById(`endereco-tooltip-${schedule.agendamento_id}`);
                    if (tooltip) {
                      tooltip.style.display = 'block';
                      const rect = e.currentTarget.getBoundingClientRect();
                      tooltip.style.left = `${rect.left - 290}px`;
                      tooltip.style.top = `${rect.top - 10}px`;
                    }
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById(`endereco-tooltip-${schedule.agendamento_id}`);
                    if (tooltip) tooltip.style.display = 'none';
                  }}
                >
                  {formatarEnderecoResumido(schedule.clientes.endereco)}
                </span>
                <Search 
                  className="h-3 w-3 text-gray-400 cursor-help hover:text-primary ml-1 inline-block" 
                  onMouseEnter={(e) => {
                    const tooltip = document.getElementById(`endereco-tooltip-${schedule.agendamento_id}`);
                    if (tooltip) {
                      tooltip.style.display = 'block';
                      const iconRect = e.currentTarget.getBoundingClientRect();
                      tooltip.style.left = `${iconRect.left - 290}px`;
                      tooltip.style.top = `${iconRect.top - 10}px`;
                    }
                  }}
                  onMouseLeave={() => {
                    const tooltip = document.getElementById(`endereco-tooltip-${schedule.agendamento_id}`);
                    if (tooltip) tooltip.style.display = 'none';
                  }}
                />
                <span 
                  id={`endereco-tooltip-${schedule.agendamento_id}`}
                  className="fixed bg-primary text-white text-xs rounded-lg pointer-events-none whitespace-normal p-3 shadow-lg" 
                  style={{ 
                    zIndex: 9999, 
                    display: 'none',
                    width: '280px', 
                    maxWidth: '90vw'
                  }}
                >
                  <div className="font-medium mb-1">Endereço Completo</div>
                  <div>
                    {formatarEnderecoCompleto(schedule.clientes.endereco)}
                  </div>
                  <div className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 border-4 border-transparent border-l-primary"></div>
                </span>
              </div>
            ) : (
              <span className="text-gray-900">Não informado</span>
            )}
          </div>
        )}
      </div>

      {/* Diálogo de confirmação para desmarcar */}
      <AlertDialog open={showUnscheduleDialog} onOpenChange={setShowUnscheduleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desmarcar agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desmarcar o horário de {schedule.clientes?.nome_completo || 'cliente'}?
            </AlertDialogDescription>
            <button 
              type="button"
              onClick={() => setShowUnscheduleDialog(false)} 
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button 
              type="button" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={() => setShowUnscheduleDialog(false)}
            >
              Cancelar
            </button>
            <AlertDialogAction 
              onClick={handleUnschedule}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Desmarcar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
