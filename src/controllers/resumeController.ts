import { Request, Response } from 'express';
import { saveLatex, convertToPDF, removeExtraSpaces, readTextFile } from '../latextUtils';
import dotenv from 'dotenv';
import * as fs from 'node:fs/promises';
import { GPTService } from '../services/gpt.service';

dotenv.config();

const gptService = new GPTService();

async function getSkillContext(jd: string): Promise<string> {
    const context = `
        Read the following job description and identify the skills that are required for this job.
        Add the identified key skills to conquer this job and add it to the below JSON file.
        Following is the job description: <JOB DESCRIPTION> ${jd} </ END JOB DESCRIPTION>
        {
            "Languages": "C, C++, Java, Python, Dart, Go, JavaScript, Rust, HTML5.",
            "Frameworks": "Angular, ReactJS, Vue.js, Django, Flask, Express.js, Electron.js, Tauri, Flutter, Ionic, Spring Boot.",
            "Technologies": "Docker, Kubernetes, REST, JSON, TypeScript, GenAI, Selenium, BS4, FastAPI.",
            "Developer Tools": "Git, Docker, Google Cloud Platform, AWS, Firecracker, Kubernetes, QEMU, Redis, Agile, SCRUM, Linux, JIRA",
            "Database": "MongoDB, PostgreSQL, Oracle, MySQL, MariaDB, Firebase, D-Graph, SQLite"
        }
        Note: Do not remove the above-mentioned skills. Only add newly identified skills.
        Ensure no duplicate skills and classify them correctly. If the skills do not fit into existing categories, create new categories.
        Return the response in JSON format.
    `;
    return removeExtraSpaces(context);
}

async function parseJson(inputString: string): Promise<Record<string, string> | null> {
    try {
        const jsonObject = JSON.parse(inputString);
        console.log('Parsed JSON successfully:', jsonObject);
        return jsonObject;
    } catch (error: any) {
        console.error('Error parsing JSON:', error.message);
        return null;
    }
}

async function updateTechnicalSkillsSection(
    inputFilePath: string,
    outputFilePath: string,
    skills: Record<string, string>
): Promise<string | null> {
    try {
        const latexContent = await fs.readFile(inputFilePath, 'utf-8');

        const sectionRegex = /\\section\{Technical Skills\}([\s\S]*?)\\resumeSubHeadingListEnd/;
        const generatedSkills = Object.entries(skills)
            .map(([key, value]) => `  \\resumeSubItem{\\textbf{${key}:} ${value}}`)
            .join('\n');

        const updatedSection = `
\\section{Technical Skills}
\\resumeSubHeadingListStart
${generatedSkills}
\\resumeSubHeadingListEnd`;

        const updatedLatexContent = latexContent.replace(sectionRegex, updatedSection);
        await fs.writeFile(outputFilePath, updatedLatexContent, 'utf-8');

        console.log(`Updated Technical Skills section in ${outputFilePath}`);
        return outputFilePath;
    } catch (error: any) {
        console.error('Error updating Technical Skills section:', error.message);
        return null;
    }
}

export const resumeController = async (req: Request, res: Response): Promise<void> => {
    console.log('Generating skills for resume');
    try {
        const { jd, jobTitle, companyName } = req.body;

        if (!jd || !companyName) {
            res.status(422).json({ error: true, message: 'Job description and company name are required' });
            return;
        }

        const context = await getSkillContext(jd);
        const gptResponse = await gptService.getCodeFromResponse({ text: context });

        const skillsJson = await parseJson(gptResponse);
        if (!skillsJson) {
            res.status(500).json({ error: true, message: 'Failed to parse GPT response into JSON' });
            return;
        }

        const outputPath = await updateTechnicalSkillsSection(
            process.env.RESUMELATEXPATH || '',
            `${process.env.CLDIRPATH || ''}${removeExtraSpaces(companyName)}/${removeExtraSpaces(companyName)}.tex`,
            skillsJson
        );

        if (!outputPath) {
            res.status(500).json({ error: true, message: 'Failed to update LaTeX file' });
            return ;
        }

        await convertToPDF(outputPath, process.env.CLDIRPATH || '', removeExtraSpaces(companyName));
        res.status(200).json({ error: false, message: 'Skills updated successfully', skills: skillsJson });
    } catch (error: any) {
        console.error('Error in resumeController:', error.message);
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
};
