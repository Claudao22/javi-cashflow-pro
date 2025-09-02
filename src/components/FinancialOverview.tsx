import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export const FinancialOverview = () => {
  // Dados simulados para demonstração
  const monthlyData = [
    { month: "Jan", receitas: 45250, gastos: 23870 },
    { month: "Dez", receitas: 38920, gastos: 21450 },
    { month: "Nov", receitas: 42180, gastos: 24120 },
    { month: "Out", receitas: 39870, gastos: 22890 },
  ];

  const clientsData = [
    { 
      name: "Empresa A Ltda", 
      status: "Em dia", 
      nextPayment: "2024-01-25",
      monthlyValue: 5500,
      pendingDocuments: 0
    },
    { 
      name: "Empresa B S.A.", 
      status: "Pendente", 
      nextPayment: "2024-01-20",
      monthlyValue: 3200,
      pendingDocuments: 2
    },
    { 
      name: "Empresa C ME", 
      status: "Em dia", 
      nextPayment: "2024-01-30",
      monthlyValue: 2800,
      pendingDocuments: 0
    },
    { 
      name: "Empresa D LTDA", 
      status: "Atrasado", 
      nextPayment: "2024-01-15",
      monthlyValue: 4200,
      pendingDocuments: 1
    }
  ];

  const upcomingTasks = [
    {
      type: "Declaração IR",
      client: "Empresa A Ltda",
      dueDate: "2024-01-25",
      priority: "alta"
    },
    {
      type: "Folha de pagamento",
      client: "Empresa B S.A.",
      dueDate: "2024-01-22",
      priority: "média"
    },
    {
      type: "Conciliação bancária",
      client: "Empresa C ME",
      dueDate: "2024-01-28",
      priority: "baixa"
    }
  ];

  const currentMonth = monthlyData[0];
  const profitMargin = ((currentMonth.receitas - currentMonth.gastos) / currentMonth.receitas) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Performance Mensal */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Performance Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => {
                const profit = data.receitas - data.gastos;
                const margin = (profit / data.receitas) * 100;
                
                return (
                  <div key={data.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{data.month} 2024</span>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Lucro: R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Margem: {margin.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-success">Receitas: R$ {data.receitas.toLocaleString('pt-BR')}</span>
                        <span className="text-danger">Gastos: R$ {data.gastos.toLocaleString('pt-BR')}</span>
                      </div>
                      <Progress 
                        value={(profit / data.receitas) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status dos Clientes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Status dos Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientsData.map((client, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    {client.status === "Em dia" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : client.status === "Pendente" ? (
                      <Clock className="w-5 h-5 text-warning" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-danger" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Próximo pagamento: {new Date(client.nextPayment).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        client.status === "Em dia" ? "default" : 
                        client.status === "Pendente" ? "secondary" : "destructive"
                      }
                      className="text-xs mb-1"
                    >
                      {client.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      R$ {client.monthlyValue.toLocaleString('pt-BR')}
                    </p>
                    {client.pendingDocuments > 0 && (
                      <p className="text-xs text-warning">
                        {client.pendingDocuments} doc(s) pendente(s)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tarefas Próximas e Métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Tarefas */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Próximas Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === "alta" ? "bg-danger" :
                      task.priority === "média" ? "bg-warning" : "bg-success"
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{task.type}</p>
                      <p className="text-xs text-muted-foreground">{task.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                    <Badge 
                      variant={
                        task.priority === "alta" ? "destructive" :
                        task.priority === "média" ? "secondary" : "default"
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas Rápidas */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Métricas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Margem de Lucro</span>
                <span className="text-sm font-bold text-success">
                  {profitMargin.toFixed(1)}%
                </span>
              </div>
              <Progress value={profitMargin} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Taxa de Inadimplência</span>
                <span className="text-sm font-bold text-warning">8.3%</span>
              </div>
              <Progress value={8.3} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Clientes Ativos</span>
                <span className="text-sm font-bold text-primary">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>

            <div className="pt-2 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Clientes Ativos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};