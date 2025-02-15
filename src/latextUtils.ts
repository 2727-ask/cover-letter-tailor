import pdflatex from 'node-pdflatex';
import fsp from 'fs/promises';
import fs from 'fs';
import dotenv from "dotenv";
import * as path from 'path';
import { promises } from 'fs';
import latex from 'node-latex';



export {
    convertToPDF,
    saveLatex,
    removeExtraSpaces,
    readTextFile,
    convertLatexToPdf
};

dotenv.config();
/**
 * Convert a LaTeX file to a PDF and save it to a specified path.
 * @param {string} sourceFilePath - The file path to the LaTeX source file.
 * @param {string} outputFilePath - The file path to save the generated PDF.
 */
async function convertToPDF(sourceFilePath: string, outputFolderPath: string, companyName: string) {
    console.log("Generating PDF", sourceFilePath, outputFolderPath);
    try {
        const source = (await fsp.readFile(sourceFilePath, 'utf-8')).trim();
        console.log("Source Generated Now Saving PDF");
        const pdf = await pdflatex(source, { shellEscape: true });
        console.log("PDF is", pdf);
        const outputfilePath = path.join(outputFolderPath + companyName + '/', `${companyName}.pdf`);
        await fsp.writeFile(outputfilePath, pdf);
        console.log(`PDF successfully saved to: ${outputfilePath}`);
        return outputfilePath;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return null;
    }
}

function removeExtraSpaces(input: string) {
    if (typeof input !== 'string') {
        throw new TypeError("Input must be a string");
    }
    // Trim leading and trailing spaces and replace multiple spaces with a single space
    return input.trim().replace(/\s+/g, ' ');
}

async function saveLatex(latex: string, companyName: string) {
    try {
        const basePath = process.env.CLDIRPATH || '/'; // Base directory
        const companyDir = path.join(basePath, companyName); // Company-specific directory
        await fsp.mkdir(companyDir, { recursive: true });
        const filePath = path.join(companyDir, `${companyName}-cover-letter.tex`);
        await fsp.writeFile(filePath, latex, 'utf8');
        console.log(`LaTeX file saved at ${filePath}`);
        return filePath;
    } catch (error) {
        console.error('Error saving LaTeX:', error);
        return null;
    }
}

async function readTextFile(filePath: string) {
    try {
        const content = await fsp.readFile(filePath, 'utf-8'); // Read file as UTF-8
        console.log("File Content:\n", content);
        return content;
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
}



async function convertLatexToPdf(inputFilePath: string, outputFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(inputFilePath)) {
            return reject(new Error(`Input LaTeX file not found: ${inputFilePath}`));
        }

        const inputStream = fs.createReadStream(inputFilePath);
        const outputStream = fs.createWriteStream(outputFilePath);
        const pdf = latex(inputStream);

        pdf.pipe(outputStream);

        pdf.on('error', (err) => reject(err));
        pdf.on('finish', () => resolve());
    });
}



