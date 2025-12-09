import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function CreateProject() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [dashboardFile, setDashboardFile] = useState<File | null>(null);
  const [databaseFile, setDatabaseFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'forecast' | 'generate'>('upload');
  const [projectId, setProjectId] = useState<number | null>(null);

  const createProjectMutation = trpc.project.create.useMutation({
    onSuccess: (data) => {
      setProjectId(data.projectId);
      setStep('forecast');
      toast.success('Project created successfully!');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  if (!isAuthenticated) {
    setLocation('/');
    return null;
  }

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!dashboardFile) {
      toast.error('Please upload a dashboard PDF file');
      return;
    }

    try {
      const dashboardBase64 = await handleFileToBase64(dashboardFile);
      const databaseBase64 = databaseFile ? await handleFileToBase64(databaseFile) : undefined;

      createProjectMutation.mutate({
        dashboardFile: {
          buffer: dashboardBase64,
          originalname: dashboardFile.name,
          mimetype: dashboardFile.type,
        },
        databaseFile: databaseBase64 && databaseFile ? {
          buffer: databaseBase64,
          originalname: databaseFile.name,
          mimetype: databaseFile.type,
        } : undefined,
      });
    } catch (error) {
      toast.error('Error processing files');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create New Portfolio
            </h1>
            <p className="text-gray-600">
              Upload your project files to generate a comprehensive financial portfolio
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                {step === 'upload' ? '1' : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <span className="ml-2 font-medium">Upload Files</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'forecast' ? 'bg-blue-600 text-white' : step === 'generate' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                {step === 'generate' ? <CheckCircle2 className="w-6 h-6" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Add Forecast</span>
            </div>
            <div className="flex-1 h-1 bg-gray-300 mx-4"></div>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 'generate' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Generate</span>
            </div>
          </div>

          {/* Step 1: Upload Files */}
          {step === 'upload' && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Project Files</CardTitle>
                <CardDescription>
                  Upload your project dashboard PDF and optionally a database file (Excel/CSV)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="dashboard">Dashboard PDF (Required)</Label>
                  <div className="mt-2">
                    <Input
                      id="dashboard"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setDashboardFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  {dashboardFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      {dashboardFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="database">Database File (Optional)</Label>
                  <p className="text-sm text-gray-500 mb-2">Excel or CSV file with cost and hours data</p>
                  <Input
                    id="database"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setDatabaseFile(e.target.files?.[0] || null)}
                  />
                  {databaseFile && (
                    <p className="text-sm text-green-600 mt-2 flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      {databaseFile.name}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setLocation('/')}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpload} 
                    disabled={!dashboardFile || createProjectMutation.isPending}
                    className="flex-1"
                  >
                    {createProjectMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload & Continue
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Add Forecast Data */}
          {step === 'forecast' && projectId && (
            <Card>
              <CardHeader>
                <CardTitle>Add Forecast Data</CardTitle>
                <CardDescription>
                  Add future invoices and expenses to complete your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setLocation(`/project/${projectId}/forecast`)}>
                  Add Forecast Data
                </Button>
                <Button variant="outline" onClick={() => setLocation(`/project/${projectId}/generate`)} className="ml-2">
                  Skip & Generate
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
