/// <reference types="node" />
export declare type Options = {
    texInputs?: string[];
    shellEscape?: boolean;
};
declare const pdflatex: (source: string, options?: Options) => Promise<Buffer>;
export default pdflatex;
