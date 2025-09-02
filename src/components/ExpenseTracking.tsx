import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Receipt, 
  Plus, 
  Calendar,
  TrendingDown,
  PieChart,
  Filter,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
}

interface ExpenseTrackingProps {
  clients: Client[];
  selectedClient: string;
  onClientChange: (clientId: string) => void;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  client: string;
  date: string;
  status: "pago" | "pendente" | "vencido";
  dueDate?: string;
  recurring: boolean;
}

export const ExpenseTracking = ({ clients, selectedClient, onClientChange }: ExpenseTrackingProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    client: selectedClient !== "all" ? selectedClient : "",
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    recurring: false
  });

  // Dados simulados de gastos
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      description: "Software de contabilidade - Licença mensal",
      amount: 299.00,
      category: "Software",
      client: "all",
      date: "2024-01-15",
      status: "pago",
      recurring: true
    },
    {
      id: "2",
      description: "Consultoria jurídica - Empresa A",
      amount: 1500.00,
      category: "Consultoria",
      client: "empresa-a",
      date: "2024-01-14",
      status: "pendente",
      dueDate: "2024-01-20",
      recurring: false
    },
    {
      id: "3",
      description: "Internet comercial",
      amount: 150.00,
      category: "Utilities",
      client: "all",
      date: "2024-01-13",
      status: "pago",
      recurring: true
    },
    {
      id: "4",
      description: "Material de escritório",
      amount: 85.50,
      category: "Material",
      client: "all",
      date: "2024-01-12",
      status: "pago",
      recurring: false
    },
    {
      id: "5",
      description: "Impostos municipais - Empresa B",
      amount: 2200.00,
      category: "Impostos",
      client: "empresa-b",
      date: "2024-01-10",
      status: "vencido",
      dueDate: "2024-01-15",
      recurring: false
    }
  ]);

  const categories = [
    { name: "Software", budget: 500 },
    { name: "Consultoria", budget: 3000 },
    { name: "Utilities", budget: 400 },
    { name: "Material", budget: 200 },
    { name: "Impostos", budget: 5000 },
    { name: "Marketing", budget: 1000 },
    { name: "Equipamentos", budget: 2000 },
    { name: "Outros", budget: 500 }
  ];

  const filteredExpenses = selectedClient === "all" 
    ? expenses 
    : expenses.filter(expense => expense.client === selectedClient || expense.client === "all");

  const expensesByCategory = categories.map(category => {
    const categoryExpenses = filteredExpenses.filter(expense => expense.category === category.name);
    const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = category.budget > 0 ? (totalSpent / category.budget) * 100 : 0;
    
    return {
      ...category,
      totalSpent,
      percentage: Math.min(percentage, 100),
      status: percentage > 90 ? "danger" : percentage > 70 ? "warning" : "success"
    };
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = filteredExpenses.filter(expense => expense.status === "pendente").length;
  const overdueExpenses = filteredExpenses.filter(expense => expense.status === "vencido").length;

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      client: newExpense.client || "all",
      date: newExpense.date,
      status: "pendente",
      dueDate: newExpense.dueDate || undefined,
      recurring: newExpense.recurring
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      description: "",
      amount: "",
      category: "",
      client: selectedClient !== "all" ? selectedClient : "",
      date: new Date().toISOString().split('T')[0],
      dueDate: "",
      recurring: false
    });
    setIsDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Gasto adicionado com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Registro de Gastos</h2>
          <p className="text-muted-foreground">Controle e categorização de despesas</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedClient} onValueChange={onClientChange}>
            <SelectTrigger className="w-64">
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
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Novo Gasto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Novo Gasto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    placeholder="Descrição do gasto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      placeholder="0,00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Select value={newExpense.client} onValueChange={(value) => setNewExpense({...newExpense, client: value})}>
                    <SelectTrigger>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Vencimento (opcional)</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newExpense.dueDate}
                      onChange={(e) => setNewExpense({...newExpense, dueDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddExpense} className="gradient-primary text-primary-foreground">
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-card-hover transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Pendentes</CardTitle>
            <Receipt className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingExpenses}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Vencidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">{overdueExpenses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Budget por Categoria */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Orçamento por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expensesByCategory.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      R$ {category.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / 
                      R$ {category.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <Badge variant={
                      category.status === "danger" ? "destructive" : 
                      category.status === "warning" ? "secondary" : "default"
                    } className="text-xs">
                      {category.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={category.percentage} 
                  className={`h-2 ${
                    category.status === "danger" ? "bg-danger/20" : 
                    category.status === "warning" ? "bg-warning/20" : "bg-success/20"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Gastos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Histórico de Gastos</span>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                <div className="flex items-center space-x-4">
                  <Receipt className="w-8 h-8 text-danger" />
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(expense.date).toLocaleDateString('pt-BR')}</span>
                      <Badge variant="outline" className="text-xs">
                        {expense.category}
                      </Badge>
                      <Badge 
                        variant={
                          expense.status === "pago" ? "default" : 
                          expense.status === "vencido" ? "destructive" : "secondary"
                        } 
                        className="text-xs"
                      >
                        {expense.status}
                      </Badge>
                      {expense.recurring && (
                        <Badge variant="outline" className="text-xs">
                          Recorrente
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-danger">
                    -R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {clients.find(c => c.id === expense.client)?.name || "Geral"}
                  </p>
                  {expense.dueDate && expense.status !== "pago" && (
                    <p className="text-xs text-warning">
                      Vence: {new Date(expense.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};