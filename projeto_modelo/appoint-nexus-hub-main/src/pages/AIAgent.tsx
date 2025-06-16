
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Settings, 
  MessageSquare, 
  Brain, 
  Zap,
  Calendar,
  Users,
  Phone,
  Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AIAgent = () => {
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [autoBooking, setAutoBooking] = useState(false);
  const [reminderMessages, setReminderMessages] = useState(true);

  const features = [
    {
      icon: MessageSquare,
      title: "Atendimento Automático",
      description: "Responde perguntas frequentes dos clientes",
      status: "ativo"
    },
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description: "Sugere horários baseado na disponibilidade",
      status: "ativo"
    },
    {
      icon: Phone,
      title: "Confirmação de Consultas",
      description: "Confirma agendamentos automaticamente",
      status: "inativo"
    },
    {
      icon: Users,
      title: "Análise de Cliente",
      description: "Analisa perfil e histórico do cliente",
      status: "ativo"
    }
  ];

  const conversations = [
    {
      id: 1,
      client: "Maria Silva",
      message: "Olá! Gostaria de agendar um corte para amanhã",
      response: "Olá Maria! Temos disponibilidade às 14h e 16h. Qual prefere?",
      timestamp: "10:30",
      status: "resolvido"
    },
    {
      id: 2,
      client: "João Santos",
      message: "Qual o valor da barba?",
      response: "O serviço de barba custa R$ 20,00 e tem duração de 20 minutos.",
      timestamp: "11:15",
      status: "resolvido"
    },
    {
      id: 3,
      client: "Ana Costa",
      message: "Preciso cancelar meu agendamento",
      response: "Claro! Qual é o seu agendamento para que eu possa cancelar?",
      timestamp: "12:00",
      status: "aguardando"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'resolvido': return 'bg-blue-100 text-blue-800';
      case 'aguardando': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agente de IA</h1>
          <p className="text-muted-foreground">Configure seu assistente virtual inteligente</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={agentEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
            {agentEnabled ? "Ativo" : "Inativo"}
          </Badge>
          <Button className="bg-primary hover:bg-secondary">
            <Settings className="w-4 h-4 mr-2" />
            Configurações Avançadas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Hoje</CardTitle>
            <MessageSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+23% vs ontem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
            <Brain className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Resolvidas automaticamente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos IA</CardTitle>
            <Calendar className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Agendados hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Resposta</CardTitle>
            <Clock className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">Resposta média</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-primary" />
                Funcionalidades Ativas
              </CardTitle>
              <CardDescription>
                Recursos de IA disponíveis no seu sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <Badge className={getStatusColor(feature.status)}>
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Agente</CardTitle>
              <CardDescription>
                Personalize o comportamento do seu assistente virtual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Agente Ativo</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar ou desativar o assistente virtual
                  </p>
                </div>
                <Switch
                  checked={agentEnabled}
                  onCheckedChange={setAgentEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Agendamento Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Permitir que a IA faça agendamentos automaticamente
                  </p>
                </div>
                <Switch
                  checked={autoBooking}
                  onCheckedChange={setAutoBooking}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Lembretes Automáticos</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembretes automáticos para clientes
                  </p>
                </div>
                <Switch
                  checked={reminderMessages}
                  onCheckedChange={setReminderMessages}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcome-message">Mensagem de Boas-vindas</Label>
                <Textarea
                  id="welcome-message"
                  placeholder="Digite a mensagem que a IA usará para cumprimentar os clientes..."
                  defaultValue="Olá! Sou o assistente virtual do salão. Como posso ajudá-lo hoje?"
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-hours">Horário de Funcionamento</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Abertura</Label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                  <div>
                    <Label className="text-sm">Fechamento</Label>
                    <Input type="time" defaultValue="18:00" />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-secondary">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversas Recentes</CardTitle>
              <CardDescription>
                Últimas interações do agente com os clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div key={conversation.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{conversation.client}</h4>
                        <Badge className={getStatusColor(conversation.status)}>
                          {conversation.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm"><strong>Cliente:</strong> {conversation.message}</p>
                      </div>
                      <div className="bg-primary/10 rounded-lg p-3">
                        <p className="text-sm"><strong>IA:</strong> {conversation.response}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgent;
