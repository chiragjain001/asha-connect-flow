import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientRegistrationForm } from "@/components/forms/PatientRegistrationForm";
import { ANCVisitForm } from "@/components/forms/ANCVisitForm";
import { ChildHealthVisitForm } from "@/components/forms/ChildHealthVisitForm";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FormsDemo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("patient");

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  const handleFormCancel = () => {
    console.log("Form cancelled");
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
              onClick={() => navigate("/welcome")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Data Entry Forms Demo</h1>
              <p className="text-sm opacity-90">Complete localization system with all 6 languages</p>
            </div>
          </div>
          <LanguageSelector showLabel={false} className="w-48" />
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patient">{t('patient_registration')}</TabsTrigger>
            <TabsTrigger value="anc">{t('anc_visit')}</TabsTrigger>
            <TabsTrigger value="child">{t('child_health_visit')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient" className="mt-6">
            <PatientRegistrationForm 
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </TabsContent>
          
          <TabsContent value="anc" className="mt-6">
            <ANCVisitForm 
              patientName="Sunita Devi"
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </TabsContent>
          
          <TabsContent value="child" className="mt-6">
            <ChildHealthVisitForm 
              patientName="Baby Rohan"
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FormsDemo;