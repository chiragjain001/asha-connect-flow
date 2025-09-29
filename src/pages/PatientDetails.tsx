import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Phone, MapPin, Calendar, Activity, Syringe, FileText, Plus } from "lucide-react";
import { mockPatients, type Patient } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const patient = mockPatients.find(p => p.id === id);

  if (!patient) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Patient Not Found</h2>
            <Button onClick={() => navigate("/asha-dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const getVaccinationStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-success text-success-foreground border-success">Completed</Badge>;
      case 'due':
        return <Badge className="bg-warning text-warning-foreground">Due</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive text-destructive-foreground">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-white/20"
              onClick={() => navigate("/asha-dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{patient.name}</h1>
              <p className="text-sm opacity-90">{patient.age} years • {patient.gender}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getSyncStatusBadge(patient.syncStatus)}
          </div>
        </div>
      </header>

      {/* Patient Overview Card */}
      <div className="p-4 pb-2">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold">{patient.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Phone className="w-4 h-4" />
                      <span>{patient.phone}</span>
                    </div>
                  </div>
                  {getRiskBadge(patient.riskLevel)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{patient.address}</span>
                  </div>
                  {patient.healthId && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Health ID:</span>
                      <span className="text-muted-foreground">{patient.healthId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                  </div>
                </div>

                {patient.conditions.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm font-medium">Current Conditions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.conditions.map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <div className="px-4 pb-20">
        <Tabs defaultValue="visits" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visits" className="flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Visits
            </TabsTrigger>
            <TabsTrigger value="vaccinations" className="flex items-center gap-1">
              <Syringe className="w-4 h-4" />
              Vaccines
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Records
            </TabsTrigger>
          </TabsList>

          {/* Visits Tab */}
          <TabsContent value="visits" className="space-y-4 mt-4">
            {patient.visits.map((visit) => (
              <Card key={visit.id} className="shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {new Date(visit.date).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardTitle>
                    <Badge variant={visit.type === 'emergency' ? 'destructive' : 'outline'}>
                      {visit.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Vitals */}
                  {Object.keys(visit.vitals).length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium mb-2">Vitals</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {visit.vitals.weight && (
                          <div>Weight: <span className="font-medium">{visit.vitals.weight} kg</span></div>
                        )}
                        {visit.vitals.height && (
                          <div>Height: <span className="font-medium">{visit.vitals.height} cm</span></div>
                        )}
                        {visit.vitals.bp && (
                          <div>BP: <span className="font-medium">{visit.vitals.bp}</span></div>
                        )}
                        {visit.vitals.temperature && (
                          <div>Temp: <span className="font-medium">{visit.vitals.temperature}°F</span></div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="mb-3">
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{visit.notes}</p>
                  </div>

                  {/* Diagnosis */}
                  {visit.diagnosis && (
                    <div>
                      <h4 className="font-medium mb-2">Diagnosis</h4>
                      <p className="text-sm text-muted-foreground">{visit.diagnosis}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <Button 
              className="w-full h-12" 
              onClick={() => toast({ title: "New visit logging would be available in production" })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Log New Visit
            </Button>
          </TabsContent>

          {/* Vaccinations Tab */}
          <TabsContent value="vaccinations" className="space-y-4 mt-4">
            {patient.vaccinations.map((vaccination) => (
              <Card key={vaccination.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{vaccination.name}</h3>
                    {getVaccinationStatus(vaccination.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Date: {new Date(vaccination.date).toLocaleDateString()}</div>
                    {vaccination.dueDate && (
                      <div>Due: {new Date(vaccination.dueDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Button 
              className="w-full h-12" 
              onClick={() => toast({ title: "Vaccination scheduling would be available in production" })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule Vaccination
            </Button>
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="records" className="space-y-4 mt-4">
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Medical Records</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Upload and manage patient documents, lab reports, and medical certificates.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Document
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientDetails;