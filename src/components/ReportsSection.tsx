import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp,
  FileText,
  Clock,
  AlertCircle,
  Building2
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Client {
  id: string;
  name: string;
}

interface ReportsSectionProps {
  clients: Client[];
  selectedClient: string;
  onClientChange: (clientId: string) => void;
}

export const ReportsSection = ({ clients, selectedClient, onClientChange }: ReportsSectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState("month");

  // Dados simulados para os relatórios
  const monthlyData = [
    { month: 'Jan', receitas: 35000, gastos: 18000, lucro: 17000 },
    { month: 'Fev', receitas: 42000, gastos: 22000, lucro: 20000 },
    { month: 'Mar', receitas: 38000, gastos: 19000, lucro: 19000 },
    { month: 'Abr', receitas: 45250, gastos: 23870, lucro: 21380 },
  ];

  const clientRevenueData = [
    { name: 'Empresa A', value: 18500, color: '#06D6A0' },
    { name: 'Empresa B', value: 15200, color: '#118AB2' },
    { name: 'Empresa C', value: 11550, color: '#073B4C' },
  ];

  // Sistema de vencimentos e alertas
  const upcomingPayments = [
    {
      id: 1,
      client: "Empresa A Ltda",
      description: "DAS - Simples Nacional",
      amount: 2450.00,
      dueDate: new Date(),
      status: "pendente",
      priority: "alta"
    },
    {
      id: 2,
      client: "Empresa B S.A.",
      description: "ICMS Estado",
      amount: 5800.00,
      dueDate: addDays(new Date(), 2),
      status: "pendente",
      priority: "media"
    },
    {
      id: 3,
      client: "Empresa C ME",
      description: "ISS Municipal",
      amount: 1200.00,
      dueDate: addDays(new Date(), 5),
      status: "pendente",
      priority: "baixa"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-danger text-danger-foreground';
      case 'media': return 'bg-warning text-warning-foreground';
      case 'baixa': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Relatórios Financeiros</h2>
          <p className="text-muted-foreground">Análises detalhadas e controle de vencimentos</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={selectedClient} onValueChange={onClientChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="payments">Vencimentos</TabsTrigger>
          <TabsTrigger value="pj-models">Modelos PJ</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  Evolução Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="receitas" fill="hsl(var(--success))" />
                    <Bar dataKey="gastos" fill="hsl(var(--danger))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Distribuição por Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientRevenueData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {clientRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Resumo Executivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total de Clientes Ativos</p>
                  <p className="text-3xl font-bold text-primary">12</p>
                  <p className="text-sm text-success">+16.7% vs mês anterior</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Receita Média por Cliente</p>
                  <p className="text-3xl font-bold text-primary">R$ 3.770,83</p>
                  <p className="text-sm text-success">+8.2% vs mês anterior</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Margem de Lucro</p>
                  <p className="text-3xl font-bold text-primary">47.2%</p>
                  <p className="text-sm text-success">+2.1% vs mês anterior</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Calendário de Vencimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Agenda do Dia</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPayments
                    .filter(payment => isSameDay(payment.dueDate, selectedDate))
                    .map(payment => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">{payment.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(payment.amount)}</p>
                          <Badge className={getPriorityColor(payment.priority)}>
                            {payment.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  
                  {upcomingPayments.filter(payment => isSameDay(payment.dueDate, selectedDate)).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum vencimento para este dia</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Próximos Vencimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingPayments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        isSameDay(payment.dueDate, new Date()) ? 'bg-danger' :
                        payment.dueDate < addDays(new Date(), 3) ? 'bg-warning' : 'bg-success'
                      }`} />
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-muted-foreground">{payment.client}</p>
                        <p className="text-sm text-muted-foreground">
                          Vence em: {format(payment.dueDate, "dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                      <Badge className={getPriorityColor(payment.priority)}>
                        {payment.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pj-models" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Modelos de Pessoa Jurídica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients
                  .filter(client => client.id !== "all")
                  .map(client => (
                    <Card key={client.id} className="border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{client.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Regime:</span>
                            <Badge variant="secondary">
                              {client.name.includes('ME') ? 'Microempresa' : 
                               client.name.includes('S.A.') ? 'Lucro Real' : 'Simples Nacional'}
                            </Badge>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">CNPJ:</span>
                            <span className="text-sm font-mono">
                              {client.name.includes('Empresa A') ? '12.345.678/0001-90' :
                               client.name.includes('Empresa B') ? '98.765.432/0001-10' : 
                               '45.678.901/0001-55'}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Atividade:</span>
                            <span className="text-sm">
                              {client.name.includes('Empresa A') ? 'Consultoria' :
                               client.name.includes('Empresa B') ? 'Comércio' : 'Serviços'}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Próximo DAS:</span>
                            <span className="text-sm font-medium text-danger">
                              {format(addDays(new Date(), Math.floor(Math.random() * 20)), "dd/MM")}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge className="bg-success text-success-foreground">Ativo</Badge>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <p className="text-sm text-muted-foreground mb-2">Impostos Mensais:</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>DAS:</span>
                              <span className="font-medium">
                                R$ {(Math.random() * 3000 + 1000).toFixed(2)}
                              </span>
                            </div>
                            {client.name.includes('S.A.') && (
                              <div className="flex justify-between text-sm">
                                <span>ICMS:</span>
                                <span className="font-medium">
                                  R$ {(Math.random() * 5000 + 2000).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};