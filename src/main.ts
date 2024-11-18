import { convertToPDF } from "./latextUtils";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { clController } from "./controllers/clController";
dotenv.config();

const inputPath = "/Users/ashutoshkumbhar/Development/tailor/res/text/demo.tex"
const outputPath = "/Users/ashutoshkumbhar/Development/tailor/res/pdf/demo.pdf";


const app: Express = express();
app.use(express.json());
const port = process.env.PORT || 5000;


app.post('/generateCL', clController);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});









