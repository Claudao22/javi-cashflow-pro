import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Plus, 
  Calendar,
  TrendingUp,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
}

interface CashFlowProps {
  clients: Client[];
  selectedClient: string;
  onClientChange: (clientId: string) => void;
}

interface CashFlowEntry {
  id: string;
  type: "entrada" | "saida";
  amount: number;
  description: string;
  category: string;
  client: string;
  date: string;
  status: "confirmado" | "pendente";
}

export const CashFlowSection = ({ clients, selectedClient, onClientChange }: CashFlowProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    type: "entrada" as "entrada" | "saida",
    amount: "",
    description: "",
    category: "",
    client: selectedClient !== "all" ? selectedClient : "",
    date: new Date().toISOString().split('T')[0]
  });

  // Dados simulados do fluxo de caixa
  const [cashFlowEntries, setCashFlowEntries] = useState<CashFlowEntry[]>([
    {
      id: "1",
      type: "entrada",
      amount: 5500.00,
      description: "Pagamento de honorários - Empresa A",
      category: "Honorários",
      client: "empresa-a",
      date: "2024-01-15",
      status: "confirmado"
    },
    {
      id: "2",
      type: "saida",
      amount: 1200.00,
      description: "Software de contabilidade",
      category: "Software",
      client: "all",
      date: "2024-01-14",
      status: "confirmado"
    },
    {
      id: "3",
      type: "entrada",
      amount: 3200.00,
      description: "Consultoria fiscal - Empresa B",
      category: "Consultoria",
      client: "empresa-b",
      date: "2024-01-13",
      status: "pendente"
    },
    {
      id: "4",
      type: "saida",
      amount: 800.00,
      description: "Internet e telefone",
      category: "Utilities",
      client: "all",
      date: "2024-01-12",
      status: "confirmado"
    }
  ]);

  const categories = [
    "Honorários",
    "Consultoria",
    "Software",
    "Utilities",
    "Marketing",
    "Equipamentos",
    "Impostos",
    "Outros"
  ];

  const filteredEntries = selectedClient === "all" 
    ? cashFlowEntries 
    : cashFlowEntries.filter(entry => entry.client === selectedClient || entry.client === "all");

  const totalEntradas = filteredEntries
    .filter(entry => entry.type === "entrada")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalSaidas = filteredEntries
    .filter(entry => entry.type === "saida")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const saldoLiquido = totalEntradas - totalSaidas;

  const handleAddEntry = () => {
    if (!newEntry.amount || !newEntry.description || !newEntry.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const entry: CashFlowEntry = {
      id: Date.now().toString(),
      type: newEntry.type,
      amount: parseFloat(newEntry.amount),
      description: newEntry.description,
      category: newEntry.category,
      client: newEntry.client || "all",
      date: newEntry.date,
      status: "confirmado"
    };

    setCashFlowEntries([entry, ...cashFlowEntries]);
    setNewEntry({
      type: "entrada",
      amount: "",
      description: "",
      category: "",
      client: selectedClient !== "all" ? selectedClient : "",
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Entrada do fluxo de caixa adicionada com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fluxo de Caixa</h2>
          <p className="text-muted-foreground">Controle de entradas e saídas financeiras</p>
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
                Nova Entrada
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Entrada no Fluxo de Caixa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={newEntry.type} onValueChange={(value: "entrada" | "saida") => setNewEntry({...newEntry, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrada">Entrada</SelectItem>
                        <SelectItem value="saida">Saída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newEntry.amount}
                      onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
                      placeholder="0,00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                    placeholder="Descrição da transação"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={newEntry.category} onValueChange={(value) => setNewEntry({...newEntry, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Select value={newEntry.client} onValueChange={(value) => setNewEntry({...newEntry, client: value})}>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddEntry} className="gradient-primary text-primary-foreground">
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
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">
              R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
            <TrendingUp className={`h-4 w-4 ${saldoLiquido >= 0 ? 'text-success' : 'text-danger'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-success' : 'text-danger'}`}>
              R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Entradas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Histórico de Transações</span>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-smooth">
                <div className="flex items-center space-x-4">
                  {entry.type === "entrada" ? (
                    <ArrowUpCircle className="w-8 h-8 text-success" />
                  ) : (
                    <ArrowDownCircle className="w-8 h-8 text-danger" />
                  )}
                  <div>
                    <p className="font-medium">{entry.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                      <Badge variant="outline" className="text-xs">
                        {entry.category}
                      </Badge>
                      <Badge variant={entry.status === "confirmado" ? "default" : "secondary"} className="text-xs">
                        {entry.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${entry.type === "entrada" ? "text-success" : "text-danger"}`}>
                    {entry.type === "entrada" ? "+" : "-"}R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {clients.find(c => c.id === entry.client)?.name || "Geral"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};