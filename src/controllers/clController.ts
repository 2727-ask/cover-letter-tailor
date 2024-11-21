import { Request, Response } from 'express';
import { GPTService } from '../services/gpt.service';
import { saveLatex, convertToPDF, removeExtraSpaces, readTextFile } from '../latextUtils';
import dotenv from 'dotenv';
import * as fs from 'node:fs/promises';
import { addRecordToExcel } from '../excelUtils';

dotenv.config();
const gptService = new GPTService();

/**
 * Generates the context for the cover letter based on the provided job role, job description, company name, and word limit.
 * @param jobRole - The role being applied for.
 * @param jobDescription - The job description.
 * @param companyName - The name of the company.
 * @param noOfWords - The word limit for the cover letter.
 * @returns A formatted string containing the context for generating the cover letter.
 */
async function getCoverLetterContext(
    jobRole: string,
    jobDescription: string,
    companyName: string,
    noOfWords: number
): Promise<string> {
    const resume: string = await readTextFile(process.env.RESUMEFILEPATH || '');
    const context = `
        You are a LaTeX cover letter generator. Your task is to create professional and concise cover letters.
        To compose a compelling cover letter, you must scrutinize the job description for key qualifications.
        Begin with a succinct introduction about the candidate's identity and career goals. 
        Highlight skills aligned with the job, underpinned by tangible examples. 
        Incorporate details about the company but do not include address, city, state, or ZIP of the company, 
        emphasising its mission or unique aspects that align with the candidate's values. 
        Ensure that percentages and other symbols are LaTeX-compatible.
        Conclude by reaffirming the candidate's suitability and inviting further discussion. 
        Use job-specific terminology for a tailored and impactful letter, maintaining a professional style suitable 
        for a ${jobRole} at the organisation ${companyName}. Please provide your response in under ${noOfWords} words.
        This is my current resume: <Start of resume> ${resume} </End of resume>
        Here is the job description for the job I'm applying for: <Job Description> ${jobDescription} </Job Description>
        Follow the latex format given bellow
        
        documentclass[11pt]{article}
usepackage[margin=1in]{geometry}
usepackage{parskip}

begin{document}

begin{flushleft}
textbf{Ashutosh Kumbhar} <linebreakhere>
Tempe, Arizona, USA <linebreakhere>
+1 623-698-7433 <linebreakhere>
akumbha3@asu.edu <linebreakhere>
linkedin.com/in/ashutosh-kumbhar <linebreakhere>
github.com/2727-ask <linebreakhere>
<todays date here>
end{flushleft}

vspace{0.5em}

textbf{Hiring Manager} <linebreakhere>
<company Name here> <linebreakhere>

vspace{1em}

<cover letter here>

Sincerely, <linebreakhere>
Ashutosh Kumbhar

end{document}

    `;
    return removeExtraSpaces(context);
}

/**
 * Controller function to handle requests for generating a cover letter.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const clController = async (req: Request, res: Response): Promise<void> => {
    console.log("Requested to generate Cover Letter");

    try {
        const { jd, jobTitle, companyName } = req.body;

        if (!jd || !jobTitle || !companyName) {
            res.status(422).json({ error: true, message: 'Please provide all mandatory information.' });
            return;
        }

        const context = await getCoverLetterContext(jobTitle, jd, companyName, 350);

        const generatedContent = await gptService.getCodeFromResponse({ text: context });

        if (!generatedContent) {
            console.error("Failed to generate cover letter content.");
            res.status(500).json({ error: true, message: 'Error generating cover letter content.' });
            return;
        }

        const sanitizedCompanyName = removeExtraSpaces(companyName);
        const outputPath = await saveLatex(generatedContent, sanitizedCompanyName);

        if (outputPath) {
            const outputPDFPath = await convertToPDF(outputPath, process.env.CLDIRPATH || '/', sanitizedCompanyName);
            console.log(`Cover letter successfully saved and converted to PDF: ${outputPath}`);
            addRecordToExcel(process.env.EXCELPATH || '/', {
                name: companyName,
                jd,
                cl: outputPDFPath || 'Failed',
                dateApplied: Date.now().toString(),// Use ISO format for date
                isEmailed: false,
                isLinkedIn: false,
            }
            )
            res.status(200).json({ error: false, message: generatedContent });
        } else {
            console.error("Failed to save LaTeX file.");
            res.status(500).json({ error: true, message: 'Error saving cover letter to LaTeX file.' });
        }
    } catch (error) {
        console.error('Error generating cover letter:', error);
        res.status(500).json({ error: true, message: 'Internal server error.' });
    }
};
