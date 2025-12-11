import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";

export default function Home() {
  const [, setLocation] = useLocation();

  // Simple navigation function that works 100% of the time
  const handleStart = () => {
    console.log("Navigating to create..."); // This logs to console if it works
    setLocation("/create");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {APP_TITLE || "My Portfolio"}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform your project dashboards into professional portfolios.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card><CardHeader><CardTitle>Upload</CardTitle><CardDescription>Upload PDF</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle>Data</CardTitle><CardDescription>Add Database</CardDescription></CardHeader></Card>
          <Card><CardHeader><CardTitle>Generate</CardTitle><CardDescription>Get Slides</CardDescription></CardHeader></Card>
        </div>

        {/* This button has NO complex logic. It just goes to /create */}
        <Button size="lg" onClick={handleStart}>
          Get Started
        </Button>
      </div>
    </div>
  );
}
