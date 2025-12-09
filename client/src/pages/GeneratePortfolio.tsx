import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, FileText, Download } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function GeneratePortfolio() {
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const [, setLocation] = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioGenerated, setPortfolioGenerated] = useState(false);

  const generateMutation = trpc.portfolio.generate.useMutation({
    onSuccess: () => {
      setIsGenerating(false);
      setPortfolioGenerated(true);
      toast.success('Portfolio generated successfully!');
    },
    onError: (error) => {
      setIsGenerating(false);
      toast.error(`Error: ${error.message}`);
    },
  });

  const { data: portfolioData, isLoading } = trpc.portfolio.getData.useQuery(
    { projectId },
    { enabled: isAuthenticated && !isNaN(projectId) }
  );

  if (!isAuthenticated) {
    setLocation('/');
    return null;
  }

  const handleGenerate = () => {
    setIsGenerating(true);
    generateMutation.mutate({ projectId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Generate Portfolio
            </h1>
            <p className="text-gray-600">
              Review your project data and generate the comprehensive financial portfolio
            </p>
          </div>

          {/* Project Summary */}
          {portfolioData && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
                <CardDescription>
                  {portfolioData.project.projectName} - {portfolioData.project.clientName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Contract Value</div>
                    <div className="text-xl font-bold">QAR {portfolioData.calculations.contractValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Current GPM</div>
                    <div className="text-xl font-bold">{(portfolioData.calculations.currentGPM / 100).toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Projected GPM</div>
                    <div className="text-xl font-bold">{(portfolioData.calculations.projectedGPM / 100).toFixed(2)}%</div>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Data Included</div>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                        Dashboard data extracted
                      </li>
                      {portfolioData.costs.length > 0 && (
                        <li className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                          {portfolioData.costs.length} cost items
                        </li>
                      )}
                      {portfolioData.hours.length > 0 && (
                        <li className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                          {portfolioData.hours.length} hours records
                        </li>
                      )}
                      {portfolioData.invoices.length > 0 && (
                        <li className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                          {portfolioData.invoices.length} invoices
                        </li>
                      )}
                      {portfolioData.expenses.length > 0 && (
                        <li className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                          {portfolioData.expenses.length} future expenses
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Portfolio Contents</div>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      <li>• Title slide with current vs baseline GPM</li>
                      <li>• Project overview with 3-tier budget analysis</li>
                      <li>• Cash position & collection status</li>
                      <li>• Invoice tracking with status</li>
                      <li>• Hours consumption analysis</li>
                      <li>• Cash flow visualization</li>
                      <li>• Cost breakdown & structure</li>
                      <li>• Profitability analysis</li>
                      <li>• Budget evolution & variances</li>
                      <li>• Risk assessment</li>
                      <li>• 12 professional slides total</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generation Status */}
          {!portfolioGenerated ? (
            <Card>
              <CardHeader>
                <CardTitle>Ready to Generate</CardTitle>
                <CardDescription>
                  Click the button below to generate your comprehensive financial portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setLocation(`/project/${projectId}/forecast`)}
                  >
                    Back to Forecast
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Portfolio...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Portfolio
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-500 border-2">
              <CardHeader>
                <div className="flex items-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <CardTitle>Portfolio Generated Successfully!</CardTitle>
                    <CardDescription>
                      Your comprehensive financial portfolio is ready
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Your 12-slide portfolio has been generated with all financial analysis, charts, and metrics.
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={() => setLocation('/projects')} className="flex-1">
                      View My Projects
                    </Button>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Generate Another
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
