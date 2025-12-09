import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface DashboardData {
  projectName: string;
  projectCode: string;
  clientName: string;
  projectManager: string;
  contractValue: number;
  baselineBudget: number;
  baselineGPM: number;
  workingBudget: number;
  currentGPM: number;
  actualCosts: number;
  projectProgress: number;
}

/**
 * Parse dashboard PDF and extract key financial metrics using Python script
 */
export async function parseDashboardPDF(pdfBuffer: Buffer): Promise<DashboardData> {
  // Write buffer to temporary file
  const tempDir = '/tmp';
  const tempFile = path.join(tempDir, `dashboard-${Date.now()}.pdf`);
  
  try {
    await fs.writeFile(tempFile, pdfBuffer);
    
    // Run Python script
    const scriptPath = path.join(__dirname, 'scripts', 'parse_pdf.py');
    const { stdout, stderr } = await execAsync(`python3 ${scriptPath} ${tempFile}`);
    
    if (stderr) {
      console.error('PDF parsing warning:', stderr);
    }
    
    const result = JSON.parse(stdout);
    
    if (result.error) {
      throw new Error(`PDF parsing error: ${result.error}`);
    }
    
    return result as DashboardData;
  } finally {
    // Clean up temp file
    try {
      await fs.unlink(tempFile);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}
