import * as xlsx from 'xlsx';
import * as path from 'path';

interface Record {
  name: string;
  jd: string;
  cl: string;
  dateApplied: string; // Use ISO format for date
  isEmailed: boolean;
  isLinkedIn: boolean;
}

export function addRecordToExcel(filePath: string, record: Record): void {
  const fullPath = path.resolve(filePath);

  // Load or create a workbook
  let workbook: xlsx.WorkBook;
  try {
    workbook = xlsx.readFile(fullPath);
  } catch (error) {
    // If the file does not exist, create a new workbook
    workbook = xlsx.utils.book_new();
  }

  // Get or create the worksheet
  const sheetName = 'Records';
  let worksheet: xlsx.WorkSheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    // Create a new worksheet with headers
    const headers = [['Name', 'JD', 'CL', 'Date Applied', 'Is Emailed', 'Is LinkedIn']];
    worksheet = xlsx.utils.aoa_to_sheet(headers);
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  // Convert the worksheet to JSON for easy manipulation
  const sheetData: any[][] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  // Add the new record as a new row
  const newRow = [
    record.name,
    record.jd,
    record.cl,
    record.dateApplied,
    record.isEmailed,
    record.isLinkedIn,
  ];
  sheetData.push(newRow);

  // Convert the updated data back to a worksheet
  const updatedWorksheet = xlsx.utils.aoa_to_sheet(sheetData);

  // Replace the old worksheet with the updated one
  workbook.Sheets[sheetName] = updatedWorksheet;

  // Write the updated workbook back to the file
  xlsx.writeFile(workbook, fullPath);
}
