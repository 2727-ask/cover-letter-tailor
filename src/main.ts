import { convertToPDF } from "./latextUtils";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { clController } from "./controllers/clController";
import { healthController } from "./controllers/healthController";
import { resumeController } from "./controllers/resumeController";
dotenv.config();

const inputPath = "/Users/ashutoshkumbhar/Development/tailor/res/text/demo.tex"
const outputPath = "/Users/ashutoshkumbhar/Development/tailor/res/pdf/demo.pdf";


const app: Express = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;


app.post('/generateCL', clController);
app.post('/generateSkills', resumeController);
app.get('/health', healthController);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});









