import * as XLSX from 'xlsx';

export interface CostItem {
  category: string;
  amount: number;
  isPaid: boolean;
  paymentDate?: Date;
  notes?: string;
}

export interface HoursItem {
  month: string; // YYYY-MM format
  hours: number;
  isForecast: boolean;
}

export interface DatabaseFileData {
  costs: CostItem[];
  hours: HoursItem[];
}

/**
 * Parse Excel/CSV database file to extract cost and hours data
 */
export async function parseDatabaseFile(fileBuffer: Buffer): Promise<DatabaseFileData> {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  const costs: CostItem[] = [];
  const hours: HoursItem[] = [];
  
  // Try to find costs sheet
  const costsSheet = workbook.Sheets['Costs'] || workbook.Sheets['Cost Breakdown'] || workbook.Sheets[workbook.SheetNames[0]];
  if (costsSheet) {
    const costsData = XLSX.utils.sheet_to_json(costsSheet);
    for (const row of costsData as any[]) {
      const category = row['Category'] || row['category'] || row['Cost Type'] || '';
      const amount = parseFloat(row['Amount'] || row['amount'] || row['Cost'] || '0');
      const isPaid = (row['Status'] || row['status'] || '').toLowerCase().includes('paid');
      const paymentDate = row['Payment Date'] || row['payment_date'] || row['Date'];
      
      if (category && amount > 0) {
        costs.push({
          category,
          amount: Math.round(amount),
          isPaid,
          paymentDate: paymentDate ? new Date(paymentDate) : undefined,
          notes: row['Notes'] || row['notes'] || '',
        });
      }
    }
  }
  
  // Try to find hours sheet
  const hoursSheet = workbook.Sheets['Hours'] || workbook.Sheets['Time'] || workbook.Sheets[workbook.SheetNames[1]];
  if (hoursSheet) {
    const hoursData = XLSX.utils.sheet_to_json(hoursSheet);
    for (const row of hoursData as any[]) {
      const month = row['Month'] || row['month'] || row['Period'] || '';
      const hoursValue = parseFloat(row['Hours'] || row['hours'] || row['Time'] || '0');
      const isForecast = (row['Type'] || row['type'] || '').toLowerCase().includes('forecast');
      
      if (month && hoursValue > 0) {
        hours.push({
          month: formatMonth(month),
          hours: Math.round(hoursValue * 100), // Store as hours * 100 for precision
          isForecast,
        });
      }
    }
  }
  
  return { costs, hours };
}

/**
 * Format month string to YYYY-MM format
 */
function formatMonth(monthStr: string): string {
  // Try to parse various date formats
  const date = new Date(monthStr);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
  
  // If parsing fails, return as-is
  return monthStr;
}
