import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, AlertTriangle, Brain, Stethoscope, Calendar, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { mockAlerts, type AIAlert } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const AIAlerts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    const matchesType = filterType === "all" || alert.type === filterType;
    return matchesSeverity && matchesType;
  });

  const getSeverityBadge = (severity: AIAlert['severity']) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-destructive text-destructive-foreground animate-pulse-glow">Critical</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-info text-info-foreground border-info">Low</Badge>;
    }
  };

  const getTypeIcon = (type: AIAlert['type']) => {
    switch (type) {
      case 'vital-signs':
        return <Stethoscope className="w-5 h-5" />;
      case 'vaccination':
        return <Calendar className="w-5 h-5" />;
      case 'risk-assessment':
        return <TrendingUp className="w-5 h-5" />;
      case 'follow-up':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: AIAlert['type']) => {
    switch (type) {
      case 'vital-signs':
        return 'Vital Signs';
      case 'vaccination':
        return 'Vaccination';
      case 'risk-assessment':
        return 'Risk Assessment';
      case 'follow-up':
        return 'Follow-up';
      default:
        return 'General';
    }
  };

  const markAsHandled = (alertId: string) => {
    toast({
      title: "Alert Acknowledged",
      description: "This alert has been marked as handled.",
    });
  };

  const stats = {
    total: mockAlerts.length,
    high: mockAlerts.filter(a => a.severity === "high").length,
    medium: mockAlerts.filter(a => a.severity === "medium").length,
    low: mockAlerts.filter(a => a.severity === "low").length,
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-gradient-accent text-accent-foreground p-4 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-accent-foreground hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-foreground/20 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI-Powered Smart Alerts</h1>
              <p className="text-sm opacity-90">Machine Learning Health Insights</p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="bg-white/10 border-0">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold">{stats.total}</div>
              <div className="text-xs opacity-90">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-0">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-destructive">{stats.high}</div>
              <div className="text-xs opacity-90">Critical</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-0">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-warning">{stats.medium}</div>
              <div className="text-xs opacity-90">Medium</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-0">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-info">{stats.low}</div>
              <div className="text-xs opacity-90">Low</div>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="p-4">
        {/* AI Info Card */}
        <Card className="shadow-card mb-4 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-accent mb-1">AI Health Monitoring Active</h3>
                <p className="text-sm text-muted-foreground">
                  On-device machine learning models (TensorFlow Lite) analyze patient data to identify health risks, 
                  predict complications, and suggest preventive interventions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="high">Critical</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vital-signs">Vital Signs</SelectItem>
              <SelectItem value="vaccination">Vaccination</SelectItem>
              <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alerts List */}
        <div className="space-y-4 pb-6">
          {filteredAlerts.map((alert, index) => (
            <Card 
              key={alert.id} 
              className={`shadow-card hover:shadow-elevated transition-all cursor-pointer animate-fade-in ${
                alert.severity === 'high' ? 'border-destructive/30' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      alert.severity === 'high' ? 'bg-destructive/10' :
                      alert.severity === 'medium' ? 'bg-warning/10' : 'bg-info/10'
                    }`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{alert.patientName}</CardTitle>
                      <CardDescription>{getTypeLabel(alert.type)} Alert</CardDescription>
                    </div>
                  </div>
                  {getSeverityBadge(alert.severity)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Alert Message */}
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-medium mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Alert
                    </h4>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-info/10 p-3 rounded-lg border border-info/20">
                    <h4 className="font-medium mb-1 flex items-center gap-2 text-info">
                      <Brain className="w-4 h-4" />
                      AI Recommendation
                    </h4>
                    <p className="text-sm text-muted-foreground">{alert.recommendation}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/patient/${alert.patientId}`)}
                      className="flex-1"
                    >
                      View Patient
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsHandled(alert.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Handled
                    </Button>
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Generated: {new Date(alert.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Alerts Found</h3>
              <p className="text-muted-foreground text-sm">
                AI monitoring is active. New alerts will appear here when health risks are detected.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIAlerts;