import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Search, Filter, Download, BarChart3, Users, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import { mockPatients, mockAlerts, type Patient } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const PHCDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");
  const [filterSync, setFilterSync] = useState<string>("all");

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.phone.includes(searchQuery) ||
                         patient.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === "all" || patient.riskLevel === filterRisk;
    const matchesSync = filterSync === "all" || patient.syncStatus === filterSync;
    
    return matchesSearch && matchesRisk && matchesSync;
  });

  const stats = {
    totalPatients: mockPatients.length,
    highRiskPatients: mockPatients.filter(p => p.riskLevel === "high").length,
    pendingSync: mockPatients.filter(p => p.syncStatus === "pending").length,
    activeAlerts: mockAlerts.filter(a => a.severity === "high").length,
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

  const getSyncStatusBadge = (status: Patient['syncStatus']) => {
    switch (status) {
      case 'synced':
        return <Badge variant="outline" className="bg-success text-success-foreground border-success">Synced</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-warning text-warning-foreground border-warning">Pending</Badge>;
      case 'offline':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Offline</Badge>;
    }
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Patient data is being exported to CSV format.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6 shadow-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">PHC Dashboard</h1>
                <p className="opacity-90">Primary Health Centre - Rampur Block</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/ai-alerts")}
                className="text-primary-foreground hover:bg-white/20"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                AI Alerts ({mockAlerts.length})
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Switch to ASHA View
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Total Patients</p>
                    <p className="text-2xl font-bold text-white">{stats.totalPatients}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary-foreground/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">High Risk</p>
                    <p className="text-2xl font-bold text-warning">{stats.highRiskPatients}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-warning/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Pending Sync</p>
                    <p className="text-2xl font-bold text-accent">{stats.pendingSync}</p>
                  </div>
                  <Activity className="w-8 h-8 text-accent/80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-foreground/80 text-sm">Active Alerts</p>
                    <p className="text-2xl font-bold text-destructive">{stats.activeAlerts}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-destructive/80" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters and Search */}
        <Card className="shadow-card mb-6">
          <CardHeader>
            <CardTitle>Patient Management</CardTitle>
            <CardDescription>
              View and manage all patient records from ASHA workers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, phone, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Risk Filter */}
              <Select value={filterRisk} onValueChange={setFilterRisk}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>

              {/* Sync Filter */}
              <Select value={filterSync} onValueChange={setFilterSync}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sync Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="synced">Synced</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button onClick={exportData} className="whitespace-nowrap">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Table */}
        <Card className="shadow-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Sync Status</TableHead>
                  <TableHead>Conditions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {patient.age} years • {patient.gender}
                        </div>
                        {patient.healthId && (
                          <div className="text-xs text-muted-foreground">
                            ID: {patient.healthId}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{patient.phone}</div>
                        <div className="text-xs text-muted-foreground">
                          {patient.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRiskBadge(patient.riskLevel)}
                    </TableCell>
                    <TableCell>
                      {new Date(patient.lastVisit).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>
                      {getSyncStatusBadge(patient.syncStatus)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {patient.conditions.slice(0, 2).map((condition, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                        {patient.conditions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{patient.conditions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No patients match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PHCDashboard;