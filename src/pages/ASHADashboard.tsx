import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, User, Clock, CheckCircle, AlertCircle, RefreshCw, Menu, Bell } from "lucide-react";
import { mockPatients, type Patient } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import p2pIcon from "/p2p-icon.png";

const ASHADashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [patients] = useState<Patient[]>(mockPatients);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  const getSyncStatusBadge = (status: Patient['syncStatus']) => {
    switch (status) {
      case 'synced':
        return <Badge variant="outline" className="bg-success text-success-foreground border-success"><CheckCircle className="w-3 h-3 mr-1" />Synced</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-warning text-warning-foreground border-warning"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-muted text-muted-foreground"><AlertCircle className="w-3 h-3 mr-1" />Offline</Badge>;
    }
  };

  const getRiskBadge = (risk: Patient['riskLevel']) => {
    switch (risk) {
      case 'high':
        return <Badge className="bg-destructive text-destructive-foreground">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-success text-success-foreground border-success">Low Risk</Badge>;
    }
  };

  const syncStatusCounts = {
    synced: patients.filter(p => p.syncStatus === 'synced').length,
    pending: patients.filter(p => p.syncStatus === 'pending').length,
    offline: patients.filter(p => p.syncStatus === 'offline').length,
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">My Households</h1>
              <p className="text-sm opacity-90">Welcome back, Sunita</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20 relative"
              onClick={() => navigate("/ai-alerts")}
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse-glow"></div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20"
              onClick={() => navigate("/p2p-sync")}
            >
              <img src={p2pIcon} alt="P2P Sync" className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-white/20"
              onClick={() => navigate("/sync")}
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Sync Status Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/10 border-0">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-success">{syncStatusCounts.synced}</div>
              <div className="text-xs opacity-90">Synced</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-0">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-warning">{syncStatusCounts.pending}</div>
              <div className="text-xs opacity-90">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-0">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-muted-foreground">{syncStatusCounts.offline}</div>
              <div className="text-xs opacity-90">Offline</div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Patient List */}
      <div className="px-4 pb-20">
        <div className="space-y-3">
          {filteredPatients.map((patient, index) => (
            <Card 
              key={patient.id} 
              className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(`/patient/${patient.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <p className="text-muted-foreground">{patient.age} years • {patient.gender}</p>
                    </div>
                  </div>
                  {getSyncStatusBadge(patient.syncStatus)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    {getRiskBadge(patient.riskLevel)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Visit</span>
                    <span className="text-sm font-medium">{new Date(patient.lastVisit).toLocaleDateString()}</span>
                  </div>

                  {patient.conditions.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Conditions: </span>
                      <span className="text-sm font-medium">{patient.conditions.join(", ")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="w-14 h-14 rounded-full shadow-elevated hover:shadow-glow bg-accent text-accent-foreground hover:bg-accent-hover"
          onClick={() => navigate("/patient-registration")}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default ASHADashboard;