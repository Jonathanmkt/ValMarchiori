
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  UserCircle, 
  Search, 
  Plus, 
  Star, 
  Calendar,
  Clock,
  Phone,
  Mail,
  Briefcase
} from 'lucide-react';

const Professionals = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const professionals = [
    {
      id: 1,
      name: "Ana Silva",
      email: "ana@salao.com",
      phone: "(11) 99999-1111",
      specialties: ["Corte", "Escova", "Coloração"],
      rating: 4.8,
      totalServices: 156,
      weeklyHours: 40,
      status: "ativo",
      avatar: null
    },
    {
      id: 2,
      name: "Carlos Santos",
      email: "carlos@salao.com",
      phone: "(11) 99999-2222",
      specialties: ["Corte Masculino", "Barba"],
      rating: 4.9,
      totalServices: 203,
      weeklyHours: 35,
      status: "ativo",
      avatar: null
    },
    {
      id: 3,
      name: "Lucia Costa",
      email: "lucia@salao.com",
      phone: "(11) 99999-3333",
      specialties: ["Manicure", "Pedicure", "Nail Art"],
      rating: 4.7,
      totalServices: 98,
      weeklyHours: 30,
      status: "ativo",
      avatar: null
    },
    {
      id: 4,
      name: "Roberto Lima",
      email: "roberto@salao.com",
      phone: "(11) 99999-4444",
      specialties: ["Massagem", "Estética"],
      rating: 4.6,
      totalServices: 45,
      weeklyHours: 20,
      status: "inativo",
      avatar: null
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getSpecialtyColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-orange-100 text-orange-800"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profissionais</h1>
          <p className="text-muted-foreground">Gerencie sua equipe de profissionais</p>
        </div>
        <Button className="bg-primary hover:bg-secondary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Profissional
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Profissionais</CardTitle>
            <UserCircle className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profissionais Ativos</CardTitle>
            <UserCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">87% do total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">⭐ Excelente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços este Mês</CardTitle>
            <Calendar className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+23% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Equipe de Profissionais</CardTitle>
          <CardDescription>Todos os profissionais cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar profissionais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={professional.avatar || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {professional.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{professional.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">{professional.rating}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(professional.status)}>
                      {professional.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="w-3 h-3 mr-2" />
                      {professional.email}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-3 h-3 mr-2" />
                      {professional.phone}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Especialidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {professional.specialties.map((specialty, index) => (
                        <Badge key={specialty} className={getSpecialtyColor(index)}>
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center text-sm text-muted-foreground mb-1">
                        <Briefcase className="w-3 h-3 mr-1" />
                        Serviços
                      </div>
                      <p className="font-semibold">{professional.totalServices}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center text-sm text-muted-foreground mb-1">
                        <Clock className="w-3 h-3 mr-1" />
                        Horas/sem
                      </div>
                      <p className="font-semibold">{professional.weeklyHours}h</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Agenda
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Professionals;
