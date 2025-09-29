import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, CheckCircle, Clock, AlertCircle, Wifi, WifiOff, Users, Share2 } from "lucide-react";
import { mockPatients } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const SyncScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<string>("2024-01-15 09:30 AM");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const pendingRecords = {
    patients: mockPatients.filter(p => p.syncStatus === 'pending').length,
    visits: mockPatients.reduce((acc, p) => acc + p.visits.length, 0),
    vaccinations: mockPatients.reduce((acc, p) => acc + p.vaccinations.filter(v => v.status === 'completed').length, 0)
  };

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: "No Internet Connection",
        description: "Please connect to internet to sync data.",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync process
    const steps = [
      { progress: 20, message: "Uploading patient records..." },
      { progress: 40, message: "Syncing visit data..." },
      { progress: 60, message: "Updating vaccination records..." },
      { progress: 80, message: "Verifying data integrity..." },
      { progress: 100, message: "Sync complete!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSyncProgress(step.progress);
      
      if (step.progress === 100) {
        setLastSyncTime(new Date().toLocaleString('en-IN', {
          year: 'numeric',
          month: '2-digit', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }));
        
        toast({
          title: "Sync Successful",
          description: "All patient data has been synchronized with the server.",
        });
      }
    }

    setIsSyncing(false);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 shadow-card">
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
            <h1 className="text-xl font-bold">Data Synchronization</h1>
            <div className="flex items-center gap-2 mt-1">
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm opacity-90">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm opacity-90">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Connection Status */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                ) : (
                  <div className="w-3 h-3 bg-destructive rounded-full"></div>
                )}
                <div>
                  <h3 className="font-semibold">
                    {isOnline ? "Connected to Internet" : "No Internet Connection"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isOnline 
                      ? "Ready to sync with PHC server" 
                      : "Working offline - data will sync when connection is available"
                    }
                  </p>
                </div>
              </div>
              {isOnline && <Badge className="bg-success text-success-foreground">Online</Badge>}
              {!isOnline && <Badge variant="destructive">Offline</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Last Sync Status */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Last Synchronization</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last synced</p>
                <p className="font-medium">{lastSyncTime}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Records Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              Pending Records
            </CardTitle>
            <CardDescription>
              Data waiting to be synchronized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-warning">{pendingRecords.patients}</div>
                <div className="text-sm text-muted-foreground">New Patients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{pendingRecords.visits}</div>
                <div className="text-sm text-muted-foreground">New Visits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{pendingRecords.vaccinations}</div>
                <div className="text-sm text-muted-foreground">Vaccinations</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sync Progress */}
        {isSyncing && (
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Synchronizing...
            </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={syncProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                {syncProgress}% complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sync Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSync}
            disabled={!isOnline || isSyncing}
            className="w-full h-12 font-medium"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/p2p-sync")}
            className="w-full h-12 font-medium"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Offline Data Sharing
          </Button>
        </div>

        {/* Offline Info */}
        {!isOnline && (
          <Card className="shadow-card border-warning">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <h3 className="font-semibold text-warning">Working Offline</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your data is being saved locally and will automatically sync when 
                    internet connection is restored. You can also share data with nearby 
                    ASHA workers using offline data sharing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SyncScreen;