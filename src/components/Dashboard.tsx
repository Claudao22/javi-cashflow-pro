import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CashFlowSection } from "./CashFlowSection";
import { ExpenseTracking } from "./ExpenseTracking";
import { ClientManagement } from "./ClientManagement";
import { FinancialOverview } from "./FinancialOverview";
import { ReportsSection } from "./ReportsSection";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  AlertTriangle 
} from "lucide-react";

export const Dashboard = () => {
  const [selectedClient, setSelectedClient] = useState("all");

  // Dados simulados dos clientes
  const clients = [
    { id: "all", name: "Todos os Clientes" },
    { id: "empresa-a", name: "Empresa A Ltda" },
    { id: "empresa-b", name: "Empresa B S.A." },
    { id: "empresa-c", name: "Empresa C ME" },
  ];

  const financialData = {
    totalRevenue: 45250.00,
    totalExpenses: 23870.00,
    netIncome: 21380.00,
    activeClients: 12,
    pendingPayments: 5,
    dueToday: 3
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">J</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Javi Dashboard</h1>
                <p className="text-muted-foreground">Sistema de Contabilidade Integrado</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Hoje
              </Button>
              <Button size="sm" className="gradient-primary text-primary-foreground">
                Sync Asaas
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-card-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Totais</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                R$ {financialData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                +12.5% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gastos Totais</CardTitle>
              <TrendingDown className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">
                R$ {financialData.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                +3.2% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                R$ {financialData.netIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                +18.7% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financialData.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                +2 novos clientes este mês
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{financialData.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Requer atenção
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-card-hover transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vencimentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-danger">{financialData.dueToday}</div>
              <p className="text-xs text-muted-foreground">
                Ação necessária
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seções Principais */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="expenses">Gastos</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <FinancialOverview />
          </TabsContent>

          <TabsContent value="cashflow" className="space-y-6">
            <CashFlowSection clients={clients} selectedClient={selectedClient} onClientChange={setSelectedClient} />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <ExpenseTracking clients={clients} selectedClient={selectedClient} onClientChange={setSelectedClient} />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsSection clients={clients} selectedClient={selectedClient} onClientChange={setSelectedClient} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};