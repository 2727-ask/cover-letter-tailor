import { Request, Response } from 'express';
import { GPTService } from '../services/gpt.service';
import { saveLatex, convertToPDF } from '../latextUtils';
import dotenv from 'dotenv';

const gptService = new GPTService();
dotenv.config();

export const clController = async (req: Request, res: Response): Promise<void> => {
    try {
        const jd = req.body.jd;
        const companyName = req.body.companyName;
        if (jd != null && companyName != null) {
            const codeContent = await gptService.getCodeFromResponse({text: jd});
            if(codeContent) {
                let clPath = await saveLatex(codeContent, companyName)
                if (clPath != null) {
                    convertToPDF(clPath, process.env.CLDIRPATH || '/', companyName);
                }
            }
            res.status(200).send({ error: false, message: codeContent })
        } else {
            res.status(422).json({ error: true, message: 'Please enter mandatory information' });
        }
    } catch (error) {
        console.error('Error in handleQuery:', error);
        res.status(500).send({ error: true, message: 'Error processing the query' });
    }
};