import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Phone, MapPin, CreditCard, Mic, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    healthId: "",
    emergencyContact: "",
    medicalHistory: "",
    allergies: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Patient Registered Successfully",
      description: `${formData.name} has been added to your patient list.`,
    });
    navigate("/asha-dashboard");
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.gender;
      case 2:
        return formData.phone && formData.address;
      case 3:
        return true; // Optional fields
      default:
        return false;
    }
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
            <h1 className="text-xl font-bold">New Patient Registration</h1>
            <p className="text-sm opacity-90">Step {currentStep} of 3</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </header>

      <div className="p-4">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the patient's basic demographic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="Enter patient's full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 text-muted-foreground hover:text-primary"
                    onClick={() => toast({ title: "Voice input would be available in production" })}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Phone number and address details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  placeholder="House No., Village, Block, District"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  type="tel"
                  placeholder="Emergency contact number"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  className="h-12"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Health Information */}
        {currentStep === 3 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Health Information
              </CardTitle>
              <CardDescription>
                Health ID and medical history (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="healthId">Health ID (ABHA)</Label>
                <div className="flex gap-2">
                  <Input
                    id="healthId"
                    placeholder="91-1234-5678-9012"
                    value={formData.healthId}
                    onChange={(e) => handleInputChange("healthId", e.target.value)}
                    className="h-12"
                  />
                  <Button
                    variant="outline"
                    className="h-12"
                    onClick={() => toast({ title: "Aadhaar scanning would be available in production" })}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Scan Aadhaar to auto-generate Health ID</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="history">Medical History</Label>
                <Textarea
                  id="history"
                  placeholder="Any known medical conditions, surgeries, etc."
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                  id="allergies"
                  placeholder="Food allergies, drug allergies, etc."
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  className="h-12"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6 pb-6">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="h-12"
            >
              Previous
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex-1 h-12 font-medium"
          >
            {currentStep === 3 ? "Register Patient" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;