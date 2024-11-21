import axios from 'axios';
import * as cheerio from 'cheerio';
import { GPTRequest } from '../interfaces/gptRequest';

export class GPTAdapter {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async postQuery(data: GPTRequest): Promise<string> {
        try {
            const response = await axios.post(this.baseUrl, data, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 100000, // Set timeout to 10 seconds (10000 ms)
            });

            console.log("Response from gpt is", response.data);

            if (response.data != undefined) {
                // Load HTML response into cheerio
                const $ = cheerio.load(response.data.text);

                // Extract content within the <code> tag
                const codeContent = $('code').text();
                return codeContent;
            } else {
                return '';
            }

        } catch (error) {
            console.error('Error in AI query adapter:', error);
            throw new Error('Failed to fetch and parse the response');
        }
    }
}

