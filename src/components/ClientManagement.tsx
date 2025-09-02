import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Building2, 
  Plus, 
  Search,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  monthlyFee: number;
  status: "ativo" | "inativo" | "pendente";
  startDate: string;
  lastUpdate: string;
  pendingDocuments: number;
  totalPaid: number;
  regime: string;
  atividade: string;
  proximoDAS: string;
  impostosMensais: {
    [key: string]: number;
  };
}

export const ClientManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newClient, setNewClient] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone: "",
    monthlyFee: ""
  });

  // Dados simulados dos clientes
  const [clients, setClients] = useState<Client[]>([
    {
      id: "empresa-a",
      name: "Empresa A Ltda",
      cnpj: "12.345.678/0001-90",
      email: "contato@empresaa.com.br",
      phone: "(11) 9 9999-9999",
      monthlyFee: 5500.00,
      status: "ativo",
      startDate: "2023-06-15",
      lastUpdate: "2024-01-15",
      pendingDocuments: 0,
      totalPaid: 38500.00,
      regime: "Simples Nacional",
      atividade: "Consultoria em TI",
      proximoDAS: "20/02/2024",
      impostosMensais: {
        das: 2450.00,
        iss: 380.00
      }
    },
    {
      id: "empresa-b",
      name: "Empresa B S.A.",
      cnpj: "98.765.432/0001-10",
      email: "financeiro@empresab.com.br",
      phone: "(11) 8 8888-8888",
      monthlyFee: 3200.00,
      status: "pendente",
      startDate: "2023-08-20",
      lastUpdate: "2024-01-10",
      pendingDocuments: 2,
      totalPaid: 16000.00,
      regime: "Lucro Real",
      atividade: "Comércio Varejista",
      proximoDAS: "25/02/2024",
      impostosMensais: {
        pis: 890.00,
        cofins: 4120.00,
        icms: 5800.00,
        irpj: 3200.00
      }
    },
    {
      id: "empresa-c",
      name: "Empresa C ME",
      cnpj: "11.222.333/0001-44",
      email: "admin@empresac.com.br",
      phone: "(11) 7 7777-7777",
      monthlyFee: 2800.00,
      status: "ativo",
      startDate: "2023-03-10",
      lastUpdate: "2024-01-12",
      pendingDocuments: 0,
      totalPaid: 28000.00,
      regime: "Microempresa",
      atividade: "Prestação de Serviços",
      proximoDAS: "18/02/2024",
      impostosMensais: {
        das: 1200.00,
        iss: 280.00
      }
    },
    {
      id: "empresa-d",
      name: "Empresa D LTDA",
      cnpj: "55.666.777/0001-88",
      email: "contabil@empresad.com.br",
      phone: "(11) 6 6666-6666",
      monthlyFee: 4200.00,
      status: "inativo",
      startDate: "2023-01-05",
      lastUpdate: "2023-12-15",
      pendingDocuments: 1,
      totalPaid: 50400.00,
      regime: "Lucro Presumido",
      atividade: "Indústria e Comércio",
      proximoDAS: "15/02/2024",
      impostosMensais: {
        irpj: 1800.00,
        csll: 720.00,
        icms: 2200.00
      }
    }
  ]);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.cnpj.includes(searchTerm) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeClients = clients.filter(client => client.status === "ativo").length;
  const totalMonthlyRevenue = clients
    .filter(client => client.status === "ativo")
    .reduce((sum, client) => sum + client.monthlyFee, 0);
  const pendingClients = clients.filter(client => client.status === "pendente").length;

  const handleAddClient = () => {
    if (!newClient.name || !newClient.cnpj || !newClient.email || !newClient.monthlyFee) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name,
      cnpj: newClient.cnpj,
      email: newClient.email,
      phone: newClient.phone,
      monthlyFee: parseFloat(newClient.monthlyFee),
      status: "pendente",
      startDate: new Date().toISOString().split('T')[0],
      lastUpdate: new Date().toISOString().split('T')[0],
      pendingDocuments: 0,
      totalPaid: 0,
      regime: "A definir",
      atividade: "A definir",
      proximoDAS: "A definir",
      impostosMensais: {}
    };

    setClients([client, ...clients]);
    setNewClient({
      name: "",
      cnpj: "",
      email: "",
      phone: "",
      monthlyFee: ""
    });
    setIsDialogOpen(false);

    toast({
      title: "Sucesso",
      description: "Cliente adicionado com sucesso!",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
          <p className="text-muted-foreground">Gerenciamento de clientes e contratos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Razão social da empresa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={newClient.cnpj}
                  onChange={(e) => setNewClient({...newClient, cnpj: e.target.value})}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="contato@empresa.com.br"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  placeholder="(11) 9 9999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyFee">Honorários Mensais (R$)</Label>
                <Input
                  id="monthlyFee"
                  type="number"
                  step="0.01"
                  value={newClient.monthlyFee}
                  onChange={(e) => setNewClient({...newClient, monthlyFee: e.target.value})}
                  placeholder="0,00"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddClient} className="gradient-primary text-primary-foreground">
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card hover:shadow-card-hover transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Building2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeClients}</div>
            <p className="text-xs text-muted-foreground">
              {((activeClients / clients.length) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {totalMonthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Dos clientes ativos
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendências</CardTitle>
            <FileText className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingClients}</div>
            <p className="text-xs text-muted-foreground">
              Clientes com pendências
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CNPJ ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="shadow-card hover:shadow-card-hover transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="gradient-primary text-primary-foreground">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">{client.cnpj}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      client.status === "ativo" ? "default" :
                      client.status === "pendente" ? "secondary" : "outline"
                    }
                  >
                    {client.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{client.email}</span>
                </div>
                
                {client.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                )}

                {/* Informações de PJ */}
                <div className="space-y-2 text-sm bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Regime:</span>
                    <Badge variant="outline" className="text-xs">
                      {client.regime}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Atividade:</span>
                    <span className="text-xs">{client.atividade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Próximo DAS:</span>
                    <span className="text-xs font-medium text-danger">{client.proximoDAS}</span>
                  </div>
                </div>

                {/* Impostos Mensais */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Impostos Mensais:</p>
                  <div className="space-y-1">
                    {Object.entries(client.impostosMensais).map(([imposto, valor]) => (
                      <div key={imposto} className="flex justify-between text-sm">
                        <span className="text-muted-foreground uppercase">{imposto}:</span>
                        <span className="font-medium">
                          R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span className="font-medium">
                      R$ {client.monthlyFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                    </span>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Total pago: R$ {client.totalPaid.toLocaleString('pt-BR')}</p>
                    <p>Cliente desde: {new Date(client.startDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                {client.pendingDocuments > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-warning bg-warning/10 p-2 rounded">
                    <FileText className="h-4 w-4" />
                    <span>{client.pendingDocuments} documento(s) pendente(s)</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Última atualização: {new Date(client.lastUpdate).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum cliente encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Tente ajustar os termos de busca" : "Adicione seu primeiro cliente para começar"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsDialogOpen(true)} className="gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cliente
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};