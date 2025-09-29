import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, Building2, Fingerprint, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");
  const [pin, setPin] = useState<string>("");

  const handleLogin = () => {
    if (!selectedRole) {
      toast({
        title: "Please select your role",
        variant: "destructive",
      });
      return;
    }

    if (!pin || pin.length < 4) {
      toast({
        title: "Please enter a valid PIN",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Login Successful",
      description: `Welcome, ${selectedRole}!`,
    });

    // Navigate based on role
    if (selectedRole === "asha") {
      navigate("/asha-dashboard");
    } else {
      navigate("/phc-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-elevated">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">ASHA Sahayika</h1>
          <p className="text-white/80">Digital Health Companion</p>
        </div>

        <Card className="shadow-elevated">
          <CardHeader className="pb-4">
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Please login to continue your healthcare mission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Languages className="w-4 h-4" />
                Language / भाषा
              </label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                  <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={selectedRole === "asha" ? "default" : "outline"}
                  onClick={() => setSelectedRole("asha")}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <User className="w-6 h-6" />
                  <span className="text-sm">ASHA Worker</span>
                </Button>
                <Button
                  variant={selectedRole === "phc" ? "default" : "outline"}
                  onClick={() => setSelectedRole("phc")}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Building2 className="w-6 h-6" />
                  <span className="text-sm">PHC Staff</span>
                </Button>
              </div>
            </div>

            {/* PIN Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Security PIN</label>
              <Input
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={4}
                className="text-center text-lg tracking-widest"
              />
            </div>

            {/* Biometric Option */}
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
              onClick={() => toast({ title: "Biometric authentication would be available in production" })}
            >
              <Fingerprint className="w-4 h-4" />
              Use Fingerprint
            </Button>

            {/* Login Button */}
            <Button onClick={handleLogin} className="w-full h-12 font-medium">
              Login
            </Button>
          </CardContent>
        </Card>

        <p className="text-white/60 text-center text-sm mt-6">
          Secure • Offline-Ready • Government Approved
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;