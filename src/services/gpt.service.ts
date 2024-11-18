import { GPTAdapter } from '../adapters/gptAdapter';
import dotenv from "dotenv";
import { GPTRequest } from '../interfaces/gptRequest';

dotenv.config();

export class GPTService {
    private gptAdapter: GPTAdapter;

    constructor() {
        this.gptAdapter = new GPTAdapter(process.env.GPTENDPOINT || '');
    }

    async getCodeFromResponse(data: GPTRequest): Promise<string> {
        return await this.gptAdapter.postQuery(data);
    }
}