/// <reference types="node" />
import { ExecOptions } from 'child_process';
export declare const exec: (command: string, options: ExecOptions) => Promise<{
    stdout: string;
    stderr: string;
}>;
export declare const readFile: (path: string) => Promise<Buffer>;
export declare const writeFile: (path: string, data: string) => Promise<void>;
export declare const createTempDirectory: () => Promise<string>;
