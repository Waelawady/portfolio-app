import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Database, TrendingUp } from "lucide-react";
import { APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {APP_TITLE}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your project dashboards and data into professional financial portfolios automatically
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <FileText className="w-12 h-12 text-blue-600 mb-2" />
                <CardTitle>Upload Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload your project dashboard PDF to extract baseline metrics
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Database className="w-12 h-12 text-green-600 mb-2" />
                <CardTitle>Add Data</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload database files and enter forecast data for complete analysis
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-purple-600 mb-2" />
                <CardTitle>Generate Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get professional 12-slide presentations with charts and insights
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          
          <Button size="lg" asChild>
            <a href={getLoginUrl()}>Get Started</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Create a new portfolio or manage your existing projects
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/create')}>
            <CardHeader>
              <Upload className="w-12 h-12 text-blue-600 mb-2" />
              <CardTitle>Create New Portfolio</CardTitle>
              <CardDescription>
                Upload project files and generate a comprehensive financial portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start New Project</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation('/projects')}>
            <CardHeader>
              <FileText className="w-12 h-12 text-green-600 mb-2" />
              <CardTitle>My Projects</CardTitle>
              <CardDescription>
                View and manage your existing project portfolios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Projects</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
