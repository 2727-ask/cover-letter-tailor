import pdflatex from 'node-pdflatex';
import fs from 'fs/promises';
import dotenv from "dotenv";
import * as path from 'path';
import { promises } from 'fs';


export {
    convertToPDF,
    saveLatex
};

dotenv.config();
/**
 * Convert a LaTeX file to a PDF and save it to a specified path.
 * @param {string} sourceFilePath - The file path to the LaTeX source file.
 * @param {string} outputFilePath - The file path to save the generated PDF.
 */
async function convertToPDF(sourceFilePath: string, outputFolderPath: string, companyName: string) {
    console.log("Generating PDF");
    try {
        const source = (await fs.readFile(sourceFilePath, 'utf-8')).trim();
        console.log(source)
        const pdf = await pdflatex(source, { shellEscape: true });
        const outputfilePath = path.join(outputFolderPath + companyName + '/', `${companyName}.pdf`);
        await fs.writeFile(outputfilePath, pdf);
        console.log(`PDF successfully saved to: ${outputfilePath}`);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}


async function saveLatex(latex: string, companyName: string) {
    try {
        const basePath = process.env.CLDIRPATH || '/'; // Base directory
        const companyDir = path.join(basePath, companyName); // Company-specific directory
        await fs.mkdir(companyDir, { recursive: true });
        const filePath = path.join(companyDir, `${companyName}.tex`);
        await fs.writeFile(filePath, latex, 'utf8');
        console.log(`LaTeX file saved at ${filePath}`);
        return filePath;
    } catch (error) {
        console.error('Error saving LaTeX:', error);
        return null;
    }
}




