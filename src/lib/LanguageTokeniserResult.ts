import { LanguageToken } from "./LanguageToken";

export class LanguageTokeniserResult {
    tokens: LanguageToken[];
    
    constructor(tokens:LanguageToken[]) {
        this.tokens = tokens;
    }
}