import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Users, Zap, ArrowRight, Smartphone } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-accent rounded-full"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="text-center md:text-left animate-fade-in">
              {/* Logo and Branding */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-white rounded-full mx-auto md:mx-0 mb-4 flex items-center justify-center shadow-elevated">
                  <Heart className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  ASHA <span className="text-accent">Sahayika</span>
                </h1>
                <p className="text-xl text-primary-foreground/90 mb-2">Digital Health Companion</p>
                <p className="text-primary-foreground/70 text-sm">
                  Empowering rural healthcare through technology
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <Shield className="w-6 h-6 mb-2 mx-auto md:mx-0" />
                  <p className="text-sm font-medium">Offline First</p>
                  <p className="text-xs opacity-80">Works without internet</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <Users className="w-6 h-6 mb-2 mx-auto md:mx-0" />
                  <p className="text-sm font-medium">Rural Ready</p>
                  <p className="text-xs opacity-80">Designed for villages</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <Zap className="w-6 h-6 mb-2 mx-auto md:mx-0" />
                  <p className="text-sm font-medium">AI Powered</p>
                  <p className="text-xs opacity-80">Smart health insights</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                  <Smartphone className="w-6 h-6 mb-2 mx-auto md:mx-0" />
                  <p className="text-sm font-medium">Mobile First</p>
                  <p className="text-xs opacity-80">Works on any device</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/welcome")} 
                  size="lg"
                  className="w-full md:w-auto bg-white text-primary hover:bg-white/90 font-medium h-14 px-8 shadow-elevated"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="animate-slide-up hidden md:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-accent rounded-2xl blur-xl opacity-30"></div>
                <img 
                  src={heroImage} 
                  alt="ASHA worker using digital health tools in rural India"
                  className="relative rounded-2xl shadow-elevated w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-white/60 text-sm">
            A Digital India Initiative • SIH 2025 • Problem Statement 25219
          </p>
          <p className="text-white/40 text-xs mt-2">
            Secure • Government Approved • Privacy First
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
