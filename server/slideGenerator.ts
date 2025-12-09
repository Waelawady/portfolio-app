import { PortfolioData } from './portfolioGenerator';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Generate all portfolio slides as HTML files
 */
export async function generateAllSlides(data: PortfolioData, outputDir: string): Promise<string[]> {
  await fs.mkdir(outputDir, { recursive: true });
  
  const slides = [
    { name: '01-title', generator: generateTitleSlide },
    { name: '02-overview', generator: generateOverviewSlide },
    { name: '03-cash-position', generator: generateCashPositionSlide },
    { name: '04-invoices', generator: generateInvoicesSlide },
    { name: '05-hours', generator: generateHoursSlide },
    { name: '06-cashflow', generator: generateCashFlowSlide },
    { name: '07-costs', generator: generateCostsSlide },
    { name: '08-structure', generator: generateStructureSlide },
    { name: '09-profitability', generator: generateProfitabilitySlide },
    { name: '10-budget-evolution', generator: generateBudgetEvolutionSlide },
    { name: '11-risks', generator: generateRisksSlide },
    { name: '12-closing', generator: generateClosingSlide },
  ];
  
  const filePaths: string[] = [];
  
  for (const slide of slides) {
    const html = slide.generator(data);
    const filePath = path.join(outputDir, `${slide.name}.html`);
    await fs.writeFile(filePath, html);
    filePaths.push(filePath);
  }
  
  // Generate index file
  const indexHtml = generateIndexPage(data, slides.map(s => `${s.name}.html`));
  const indexPath = path.join(outputDir, 'index.html');
  await fs.writeFile(indexPath, indexHtml);
  
  return filePaths;
}

function formatCurrency(amount: number): string {
  return `QAR ${amount.toLocaleString()}`;
}

function formatPercent(value: number): string {
  return `${(value / 100).toFixed(2)}%`;
}

function generateTitleSlide(data: PortfolioData): string {
  const { project, calculations } = data;
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Title</title>
<style>
body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;min-height:100vh}
.container{width:1280px;height:720px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;text-align:center}
.title{font-size:48px;font-weight:700;color:#1a202c;margin-bottom:20px}
.subtitle{font-size:32px;color:#4a5568;margin-bottom:40px}
.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;width:100%;max-width:900px;margin-top:40px}
.metric{background:#f7fafc;padding:25px;border-radius:12px;border-left:4px solid #667eea}
.label{font-size:14px;color:#718096;text-transform:uppercase;margin-bottom:8px}
.value{font-size:28px;font-weight:700;color:#1a202c}
.highlight{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:20px 40px;border-radius:50px;font-size:18px;margin-top:30px}
</style></head><body><div class="container">
<div class="title">${project.projectName}</div>
<div class="subtitle">${project.clientName || 'Financial Portfolio'}</div>
<div class="metrics">
<div class="metric"><div class="label">Contract Value</div><div class="value">${formatCurrency(calculations.contractValue)}</div></div>
<div class="metric"><div class="label">Project Code</div><div class="value">${project.projectCode || 'N/A'}</div></div>
<div class="metric"><div class="label">Progress</div><div class="value">${formatPercent(project.projectProgress)}</div></div>
</div>
<div class="highlight"><strong>Current GPM: ${formatPercent(calculations.currentGPM)}</strong><br>
<span style="font-size:14px">vs Baseline: ${formatPercent(calculations.baselineGPM)}</span></div>
</div></body></html>`;
}

function generateOverviewSlide(data: PortfolioData): string {
  const { project, calculations } = data;
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Overview</title>
<style>
body{margin:0;font-family:Arial,sans-serif;background:#f5f5f5;padding:40px}
.container{max-width:1200px;margin:0 auto;background:#fff;padding:40px;border-radius:8px}
h1{color:#1a202c;margin-bottom:30px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:30px}
.card{background:#f7fafc;padding:20px;border-radius:8px;border-left:4px solid #667eea}
.card-label{font-size:12px;color:#718096;text-transform:uppercase;margin-bottom:8px}
.card-value{font-size:24px;font-weight:700;color:#1a202c}
.card-sub{font-size:14px;color:#4a5568;margin-top:5px}
table{width:100%;border-collapse:collapse;margin-top:20px}
th{background:#1a202c;color:#fff;padding:12px;text-align:left;font-size:14px}
td{padding:12px;border-bottom:1px solid #e2e8f0;font-size:14px}
tr:nth-child(even){background:#f7fafc}
</style></head><body><div class="container">
<h1>Project Overview & Financial Analysis</h1>
<div class="grid">
<div class="card"><div class="card-label">Contract Fee</div><div class="card-value">${formatCurrency(calculations.contractValue)}</div></div>
<div class="card"><div class="card-label">Current GPM</div><div class="card-value">${formatPercent(calculations.currentGPM)}</div><div class="card-sub">Baseline: ${formatPercent(calculations.baselineGPM)}</div></div>
<div class="card"><div class="card-label">Projected GPM</div><div class="card-value">${formatPercent(calculations.projectedGPM)}</div><div class="card-sub">At completion</div></div>
</div>
<table>
<tr><th>Metric</th><th>Baseline</th><th>Current</th><th>Projected</th></tr>
<tr><td>Budget</td><td>${formatCurrency(calculations.baselineBudget)}</td><td>${formatCurrency(calculations.workingBudget)}</td><td>${formatCurrency(calculations.forecastTotalCosts)}</td></tr>
<tr><td>GPM</td><td>${formatPercent(calculations.baselineGPM)}</td><td>${formatPercent(calculations.currentGPM)}</td><td>${formatPercent(calculations.projectedGPM)}</td></tr>
<tr><td>Gross Profit</td><td>${formatCurrency(calculations.contractValue - calculations.baselineBudget)}</td><td>${formatCurrency(calculations.currentGrossProfit)}</td><td>${formatCurrency(calculations.projectedGrossProfit)}</td></tr>
</table>
</div></body></html>`;
}

function generateCashPositionSlide(data: PortfolioData): string {
  const { calculations } = data;
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Cash Position</title>
<style>
body{margin:0;font-family:Arial,sans-serif;background:#f5f5f5;padding:40px}
.container{max-width:1200px;margin:0 auto;background:#fff;padding:40px;border-radius:8px}
h1{color:#1a202c;margin-bottom:30px}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.card{background:#f7fafc;padding:20px;border-radius:8px;text-align:center}
.card-label{font-size:12px;color:#718096;text-transform:uppercase;margin-bottom:8px}
.card-value{font-size:28px;font-weight:700;color:#1a202c}
.positive{color:#10b981}
.negative{color:#ef4444}
</style></head><body><div class="container">
<h1>Cash Position & Collection Status</h1>
<div class="grid">
<div class="card"><div class="card-label">Total Invoiced</div><div class="card-value">${formatCurrency(calculations.totalInvoiced)}</div></div>
<div class="card"><div class="card-label">Total Paid</div><div class="card-value class="positive">${formatCurrency(calculations.totalPaid)}</div></div>
<div class="card"><div class="card-label">Outstanding</div><div class="card-value class="negative">${formatCurrency(calculations.totalOutstanding)}</div></div>
<div class="card"><div class="card-label">Collection Rate</div><div class="card-value">${formatPercent(calculations.collectionRate)}</div></div>
</div>
<div style="margin-top:40px;padding:30px;background:#f7fafc;border-radius:8px;text-align:center">
<div style="font-size:14px;color:#718096;margin-bottom:10px">NET CASH POSITION</div>
<div style="font-size:36px;font-weight:700;color:${calculations.netCashPosition >= 0 ? '#10b981' : '#ef4444'}">${formatCurrency(calculations.netCashPosition)}</div>
<div style="font-size:14px;color:#4a5568;margin-top:10px">Paid (${formatCurrency(calculations.totalPaid)}) - Costs (${formatCurrency(calculations.actualCosts)})</div>
</div>
</div></body></html>`;
}

// Simplified generators for remaining slides
function generateInvoicesSlide(data: PortfolioData): string {
  const { invoices } = data;
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Invoices</title>
<style>body{margin:0;font-family:Arial,sans-serif;background:#f5f5f5;padding:40px}.container{max-width:1200px;margin:0 auto;background:#fff;padding:40px;border-radius:8px}h1{color:#1a202c;margin-bottom:30px}table{width:100%;border-collapse:collapse}th{background:#1a202c;color:#fff;padding:12px;text-align:left}td{padding:12px;border-bottom:1px solid #e2e8f0}.status-paid{color:#10b981;font-weight:700}.status-unpaid{color:#ef4444;font-weight:700}.status-submitted{color:#f59e0b;font-weight:700}.status-to_submit{color:#6b7280;font-weight:700}</style></head><body><div class="container">
<h1>Invoice Tracking & Status</h1>
<table><tr><th>Invoice #</th><th>Amount</th><th>Date</th><th>Status</th><th>Notes</th></tr>
${invoices.map(inv => `<tr><td>${inv.invoiceNumber}</td><td>${formatCurrency(inv.amount)}</td><td>${inv.submissionDate ? new Date(inv.submissionDate).toLocaleDateString() : 'TBC'}</td><td class="status-${inv.status}">${inv.status.toUpperCase()}</td><td>${inv.notes || '-'}</td></tr>`).join('')}
</table></div></body></html>`;
}

function generateHoursSlide(data: PortfolioData): string {
  const { calculations } = data;
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Hours</title>
<style>body{margin:0;font-family:Arial,sans-serif;background:#f5f5f5;padding:40px}.container{max-width:1200px;margin:0 auto;background:#fff;padding:40px;border-radius:8px}h1{color:#1a202c;margin-bottom:30px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.card{background:#f7fafc;padding:20px;border-radius:8px;text-align:center}.card-label{font-size:12px;color:#718096;text-transform:uppercase;margin-bottom:8px}.card-value{font-size:28px;font-weight:700;color:#1a202c}</style></head><body><div class="container">
<h1>Hours Consumption Analysis</h1>
<div class="grid">
<div class="card"><div class="card-label">Actual Hours</div><div class="card-value">${calculations.totalActualHours.toFixed(2)}</div></div>
<div class="card"><div class="card-label">Forecast Hours</div><div class="card-value">${calculations.totalForecastHours.toFixed(2)}</div></div>
<div class="card"><div class="card-label">Total Hours</div><div class="card-value">${calculations.totalProjectHours.toFixed(2)}</div></div>
<div class="card"><div class="card-label">Avg Rate</div><div class="card-value">${formatCurrency(calculations.averageHourlyRate)}/hr</div></div>
</div></div></body></html>`;
}

// Placeholder generators for remaining slides
function generateCashFlowSlide(data: PortfolioData): string {
  return generateSimpleSlide('Cash Flow Visualization', 'Cash flow chart placeholder');
}

function generateCostsSlide(data: PortfolioData): string {
  return generateSimpleSlide('Cost Breakdown', 'Cost breakdown table placeholder');
}

function generateStructureSlide(data: PortfolioData): string {
  return generateSimpleSlide('Cost Structure Analysis', 'Cost structure chart placeholder');
}

function generateProfitabilitySlide(data: PortfolioData): string {
  const { calculations } = data;
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Profitability</title>
<style>body{margin:0;font-family:Arial,sans-serif;background:#f5f5f5;padding:40px}.container{max-width:1200px;margin:0 auto;background:#fff;padding:40px;border-radius:8px}h1{color:#1a202c;margin-bottom:30px}table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#1a202c;color:#fff;padding:12px;text-align:left}td{padding:12px;border-bottom:1px solid #e2e8f0}</style></head><body><div class="container">
<h1>Profitability Analysis</h1>
<table><tr><th>Metric</th><th>Current</th><th>Projected</th><th>Variance</th></tr>
<tr><td>Gross Profit</td><td>${formatCurrency(calculations.currentGrossProfit)}</td><td>${formatCurrency(calculations.projectedGrossProfit)}</td><td>${formatCurrency(calculations.projectedGrossProfit - calculations.currentGrossProfit)}</td></tr>
<tr><td>GPM</td><td>${formatPercent(calculations.currentGPM)}</td><td>${formatPercent(calculations.projectedGPM)}</td><td>${formatPercent(calculations.projectedGPM - calculations.currentGPM)}</td></tr>
</table></div></body></html>`;
}

function generateBudgetEvolutionSlide(data: PortfolioData): string {
  const { calculations } = data;
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Budget Evolution</title>
<style>body{margin:0;font-family:Arial,sans-serif;background:#f5f5f5;padding:40px}.container{max-width:1200px;margin:0 auto;background:#fff;padding:40px;border-radius:8px}h1{color:#1a202c;margin-bottom:30px}table{width:100%;border-collapse:collapse}th{background:#1a202c;color:#fff;padding:12px;text-align:left}td{padding:12px;border-bottom:1px solid #e2e8f0}</style></head><body><div class="container">
<h1>Budget Evolution & Variance Analysis</h1>
<table><tr><th>Budget Type</th><th>Amount</th><th>GPM</th><th>Variance from Baseline</th></tr>
<tr><td>Baseline</td><td>${formatCurrency(calculations.baselineBudget)}</td><td>${formatPercent(calculations.baselineGPM)}</td><td>-</td></tr>
<tr><td>Current/Working</td><td>${formatCurrency(calculations.workingBudget)}</td><td>${formatPercent(calculations.currentGPM)}</td><td>${formatCurrency(calculations.baselineToCurrentVariance)} (${formatPercent(calculations.baselineToCurrentVariancePercent)})</td></tr>
<tr><td>Forecast</td><td>${formatCurrency(calculations.forecastTotalCosts)}</td><td>${formatPercent(calculations.projectedGPM)}</td><td>${formatCurrency(calculations.baselineToForecastVariance)} (${formatPercent(calculations.baselineToForecastVariancePercent)})</td></tr>
</table></div></body></html>`;
}

function generateRisksSlide(data: PortfolioData): string {
  return generateSimpleSlide('Risk Analysis & Mitigation', 'Risk assessment placeholder');
}

function generateClosingSlide(data: PortfolioData): string {
  const { project } = data;
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Closing</title>
<style>body{margin:0;font-family:Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;min-height:100vh}.container{width:1280px;height:720px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;text-align:center}.title{font-size:48px;font-weight:700;color:#1a202c;margin-bottom:20px}.subtitle{font-size:24px;color:#4a5568}</style></head><body><div class="container">
<div class="title">Thank You</div>
<div class="subtitle">${project.projectName}</div>
<div style="margin-top:40px;color:#718096">Portfolio Generated: ${new Date().toLocaleDateString()}</div>
</div></body></html>`;
}

function generateSimpleSlide(title: string, content: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${title}</title>
<style>body{margin:0;font-family:Arial,sans-serif;background:#f5f5f5;padding:40px}.container{max-width:1200px;margin:0 auto;background:#fff;padding:40px;border-radius:8px}h1{color:#1a202c;margin-bottom:30px}.content{font-size:18px;color:#4a5568}</style></head><body><div class="container">
<h1>${title}</h1>
<div class="content">${content}</div>
</div></body></html>`;
}

function generateIndexPage(data: PortfolioData, slideFiles: string[]): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${data.project.projectName} - Portfolio</title>
<style>body{margin:0;font-family:Arial,sans-serif;padding:20px}h1{color:#1a202c}.slides{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-top:20px}.slide-link{display:block;padding:20px;background:#f7fafc;border-radius:8px;text-decoration:none;color:#1a202c;border:2px solid transparent;transition:all 0.2s}.slide-link:hover{border-color:#667eea;background:#fff}</style></head><body>
<h1>${data.project.projectName} - Financial Portfolio</h1>
<div class="slides">
${slideFiles.map((file, i) => `<a href="${file}" class="slide-link">Slide ${i + 1}: ${file.replace('.html', '').replace(/^\d+-/, '').replace(/-/g, ' ')}</a>`).join('\n')}
</div></body></html>`;
}
