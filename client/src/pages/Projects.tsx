import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Projects() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: projects, isLoading } = trpc.project.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    setLocation('/');
    return null;
  }

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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Projects
            </h1>
            <p className="text-gray-600">
              View and manage your project portfolios
            </p>
          </div>
          <Button onClick={() => setLocation('/create')}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {!projects || projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first project portfolio to get started
              </p>
              <Button onClick={() => setLocation('/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.projectName}</CardTitle>
                  <CardDescription>{project.clientName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Project Code:</span>
                      <span className="font-medium">{project.projectCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contract Value:</span>
                      <span className="font-medium">QAR {project.contractValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current GPM:</span>
                      <span className="font-medium">{(project.currentGPM / 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Progress:</span>
                      <span className="font-medium">{(project.projectProgress / 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation(`/project/${project.id}/generate`)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Portfolio
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
