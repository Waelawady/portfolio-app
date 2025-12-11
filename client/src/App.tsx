import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Import all your pages
import Home from "@/pages/Home";
import CreateProject from "@/pages/CreateProject";
import ForecastData from "@/pages/ForecastData";
import GeneratePortfolio from "@/pages/GeneratePortfolio";
import Projects from "@/pages/Projects";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        
        {/* The Router handles the navigation */}
        <Router hook={useHashLocation}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/create" component={CreateProject} />
            <Route path="/projects" component={Projects} />
            <Route path="/project/:id/forecast" component={ForecastData} />
            <Route path="/project/:id/generate" component={GeneratePortfolio} />
            <Route component={NotFound} />
          </Switch>
        </Router>

      </TooltipProvider>
    </ThemeProvider>
  );
}
