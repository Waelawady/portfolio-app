import * as db from './db';

export interface PortfolioData {
  project: any;
  costs: any[];
  hours: any[];
  invoices: any[];
  expenses: any[];
  calculations: FinancialCalculations;
}

export interface FinancialCalculations {
  // Contract and Budget
  contractValue: number;
  baselineBudget: number;
  baselineGPM: number;
  workingBudget: number;
  currentGPM: number;
  
  // Costs
  actualCosts: number;
  totalFutureCosts: number;
  forecastTotalCosts: number;
  
  // Profit Calculations
  currentGrossProfit: number;
  projectedGrossProfit: number;
  projectedGPM: number;
  
  // Budget Variances
  baselineToCurrentVariance: number;
  baselineToCurrentVariancePercent: number;
  currentToForecastVariance: number;
  currentToForecastVariancePercent: number;
  baselineToForecastVariance: number;
  baselineToForecastVariancePercent: number;
  
  // Hours
  totalActualHours: number;
  totalForecastHours: number;
  totalProjectHours: number;
  averageHourlyRate: number;
  
  // Invoices
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  collectionRate: number;
  
  // Cash Flow
  netCashPosition: number;
}

/**
 * Calculate all financial metrics for portfolio generation
 */
export async function calculateFinancials(projectId: number): Promise<FinancialCalculations> {
  const project = await db.getProjectById(projectId);
  if (!project) throw new Error('Project not found');
  
  const costs = await db.getProjectCosts(projectId);
  const hours = await db.getProjectHours(projectId);
  const invoices = await db.getProjectInvoices(projectId);
  const expenses = await db.getProjectExpenses(projectId);
  
  // Calculate actual costs
  const actualCosts = project.actualCosts;
  
  // Calculate future costs (remaining hours + future expenses)
  const futureExpensesCost = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingHoursCost = project.workingBudget - actualCosts; // Available budget for hours
  const totalFutureCosts = remainingHoursCost + futureExpensesCost;
  
  // Forecast total costs
  const forecastTotalCosts = actualCosts + totalFutureCosts;
  
  // Current profit (based on actual costs)
  const currentGrossProfit = project.contractValue - actualCosts;
  const currentGPM = project.currentGPM; // Already stored as percentage * 100
  
  // Projected profit (based on forecast costs)
  const projectedGrossProfit = project.contractValue - forecastTotalCosts;
  const projectedGPM = Math.round((projectedGrossProfit / project.contractValue) * 10000); // Store as percentage * 100
  
  // Budget variances
  const baselineToCurrentVariance = project.workingBudget - project.baselineBudget;
  const baselineToCurrentVariancePercent = Math.round((baselineToCurrentVariance / project.baselineBudget) * 10000);
  
  const currentToForecastVariance = forecastTotalCosts - project.workingBudget;
  const currentToForecastVariancePercent = Math.round((currentToForecastVariance / project.workingBudget) * 10000);
  
  const baselineToForecastVariance = forecastTotalCosts - project.baselineBudget;
  const baselineToForecastVariancePercent = Math.round((baselineToForecastVariance / project.baselineBudget) * 10000);
  
  // Hours calculations
  const actualHours = hours.filter(h => h.isForecast === 0);
  const forecastHours = hours.filter(h => h.isForecast === 1);
  
  const totalActualHours = actualHours.reduce((sum, h) => sum + h.hours, 0) / 100; // Stored as hours * 100
  const totalForecastHours = forecastHours.reduce((sum, h) => sum + h.hours, 0) / 100;
  const totalProjectHours = totalActualHours + totalForecastHours;
  
  // Calculate average hourly rate from actual costs and hours
  const averageHourlyRate = totalActualHours > 0 ? Math.round((actualCosts / totalActualHours) * 100) / 100 : 0;
  
  // Invoice calculations
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;
  const collectionRate = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 10000) : 0;
  
  // Cash flow
  const netCashPosition = totalPaid - actualCosts;
  
  return {
    contractValue: project.contractValue,
    baselineBudget: project.baselineBudget,
    baselineGPM: project.baselineGPM,
    workingBudget: project.workingBudget,
    currentGPM,
    
    actualCosts,
    totalFutureCosts,
    forecastTotalCosts,
    
    currentGrossProfit,
    projectedGrossProfit,
    projectedGPM,
    
    baselineToCurrentVariance,
    baselineToCurrentVariancePercent,
    currentToForecastVariance,
    currentToForecastVariancePercent,
    baselineToForecastVariance,
    baselineToForecastVariancePercent,
    
    totalActualHours,
    totalForecastHours,
    totalProjectHours,
    averageHourlyRate,
    
    totalInvoiced,
    totalPaid,
    totalOutstanding,
    collectionRate,
    
    netCashPosition,
  };
}

/**
 * Get all data needed for portfolio generation
 */
export async function getPortfolioData(projectId: number): Promise<PortfolioData> {
  const project = await db.getProjectById(projectId);
  if (!project) throw new Error('Project not found');
  
  const costs = await db.getProjectCosts(projectId);
  const hours = await db.getProjectHours(projectId);
  const invoices = await db.getProjectInvoices(projectId);
  const expenses = await db.getProjectExpenses(projectId);
  const calculations = await calculateFinancials(projectId);
  
  return {
    project,
    costs,
    hours,
    invoices,
    expenses,
    calculations,
  };
}
