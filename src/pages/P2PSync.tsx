import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Smartphone, Wifi, Users, Download, Upload, CheckCircle, Clock, Radio } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NearbyDevice {
  id: string;
  name: string;
  type: "asha" | "phc";
  distance: "nearby" | "close" | "far";
  batteryLevel?: number;
  dataToSync: {
    patients: number;
    visits: number;
    vaccinations: number;
  };
}

const P2PSync = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([]);

  // Mock nearby devices
  const mockDevices: NearbyDevice[] = [
    {
      id: "asha-001",
      name: "Priya ASHA Worker",
      type: "asha",
      distance: "nearby",
      batteryLevel: 85,
      dataToSync: { patients: 3, visits: 8, vaccinations: 2 }
    },
    {
      id: "asha-002", 
      name: "Ravi ASHA Worker",
      type: "asha",
      distance: "close",
      batteryLevel: 60,
      dataToSync: { patients: 1, visits: 5, vaccinations: 1 }
    },
    {
      id: "phc-001",
      name: "PHC Rampur Central",
      type: "phc",
      distance: "far",
      dataToSync: { patients: 0, visits: 0, vaccinations: 0 }
    }
  ];

  const startScanning = () => {
    setIsScanning(true);
    setNearbyDevices([]);
    
    // Simulate device discovery
    setTimeout(() => {
      setNearbyDevices([mockDevices[0]]);
      toast({ title: "Device found: " + mockDevices[0].name });
    }, 2000);
    
    setTimeout(() => {
      setNearbyDevices(prev => [...prev, mockDevices[1]]);
      toast({ title: "Device found: " + mockDevices[1].name });
    }, 4000);
    
    setTimeout(() => {
      setNearbyDevices(mockDevices);
      toast({ title: "Device found: " + mockDevices[2].name });
      setIsScanning(false);
    }, 6000);
  };

  const syncWithDevice = async (device: NearbyDevice) => {
    setSyncing(true);
    setSyncProgress(0);
    
    const steps = [
      { progress: 25, message: "Establishing secure connection..." },
      { progress: 50, message: "Exchanging patient data..." },
      { progress: 75, message: "Syncing visit records..." },
      { progress: 100, message: "Sync complete!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSyncProgress(step.progress);
    }
    
    toast({
      title: "Sync Successful",
      description: `Data exchanged with ${device.name}`,
    });
    
    setSyncing(false);
  };

  const getDistanceBadge = (distance: NearbyDevice['distance']) => {
    switch (distance) {
      case 'nearby':
        return <Badge className="bg-success text-success-foreground">Very Close</Badge>;
      case 'close':
        return <Badge className="bg-warning text-warning-foreground">Close</Badge>;
      case 'far':
        return <Badge variant="outline">Far</Badge>;
    }
  };

  const getDeviceIcon = (type: NearbyDevice['type']) => {
    return type === "phc" ? <Radio className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="bg-gradient-secondary text-secondary-foreground p-4 shadow-card">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-secondary-foreground hover:bg-white/20"
            onClick={() => navigate("/sync")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Peer-to-Peer Data Sync</h1>
              <p className="text-sm opacity-90">Offline Data Sharing via Wi-Fi Direct</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Feature Explanation */}
        <Card className="shadow-card border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <Share2 className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-secondary mb-1">Data Mule Technology</h3>
                <p className="text-sm text-muted-foreground">
                  Share health data securely with nearby ASHA workers and PHC staff without internet. 
                  Uses Wi-Fi Direct and Bluetooth for encrypted offline data transfer.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scan for Devices */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Nearby Healthcare Workers
            </CardTitle>
            <CardDescription>
              Discover and connect with ASHA workers and PHC staff nearby
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={startScanning}
              disabled={isScanning}
              className="w-full h-12 mb-4"
            >
              {isScanning ? (
                <>
                  <Radio className="w-4 h-4 mr-2 animate-pulse" />
                  Scanning for devices...
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 mr-2" />
                  Start Device Discovery
                </>
              )}
            </Button>

            {isScanning && (
              <div className="text-center">
                <div className="animate-pulse text-sm text-muted-foreground">
                  Looking for healthcare workers in range...
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync Progress */}
        {isSyncing && (
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 animate-pulse" />
                Syncing Data...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={syncProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2 text-center">
                {syncProgress}% complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* Nearby Devices List */}
        {nearbyDevices.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Available Devices ({nearbyDevices.length})
            </h3>
            
            {nearbyDevices.map((device, index) => (
              <Card 
                key={device.id} 
                className="shadow-card hover:shadow-elevated transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        device.type === 'phc' ? 'bg-primary/10' : 'bg-secondary/10'
                      }`}>
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{device.name}</h4>
                        <p className="text-sm text-muted-foreground capitalize">
                          {device.type === 'phc' ? 'PHC Staff' : 'ASHA Worker'}
                        </p>
                      </div>
                    </div>
                    {getDistanceBadge(device.distance)}
                  </div>

                  {/* Data Summary */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-sm font-medium">{device.dataToSync.patients}</div>
                      <div className="text-xs text-muted-foreground">Patients</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-sm font-medium">{device.dataToSync.visits}</div>
                      <div className="text-xs text-muted-foreground">Visits</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-sm font-medium">{device.dataToSync.vaccinations}</div>
                      <div className="text-xs text-muted-foreground">Vaccines</div>
                    </div>
                  </div>

                  {/* Battery Level */}
                  {device.batteryLevel && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <div className="w-4 h-2 border rounded-sm">
                        <div 
                          className={`h-full rounded-sm ${
                            device.batteryLevel > 60 ? 'bg-success' : 
                            device.batteryLevel > 30 ? 'bg-warning' : 'bg-destructive'
                          }`}
                          style={{ width: `${device.batteryLevel}%` }}
                        />
                      </div>
                      <span>{device.batteryLevel}%</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncWithDevice(device)}
                      disabled={isSyncing}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Receive Data
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => syncWithDevice(device)}
                      disabled={isSyncing}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Send Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">How it Works</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5" />
              <span>Uses Wi-Fi Direct for high-speed local data transfer</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5" />
              <span>All data is encrypted during transfer for security</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5" />
              <span>Works completely offline without internet</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5" />
              <span>Automatically merges data and resolves conflicts</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default P2PSync;