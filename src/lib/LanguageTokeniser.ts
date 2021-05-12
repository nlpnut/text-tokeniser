import { LanguageToken } from './LanguageToken';
import { LanguageTokeniserResult } from './LanguageTokeniserResult';

const digits = '0123456789';

const lowLevelTokenType = {
    word:"word", // Letters and digits
    whitespace: 'whitespace', // space and tab
    control: 'control', // \r \n
    symbol: 'symbol' // everything else eg - / \ @ ' 
};

export class LanguageTokeniser {

    static lowLevelTokenType = {
        word:"word", // Letters and digits
        whitespace: 'whitespace', // space and tab
        control: 'control', // \r \n
        symbol: 'symbol' // everything else eg - / \ @ ' 
    };
    

    process(text: string):LanguageTokeniserResult {
        const tokens:LanguageToken[] = [];

        let index = 0;
        while (index < text.length) {
            const token:LanguageToken = this.processFromNewToken(index, tokens, text);
            token.text = text.substring(token.startIndex, token.endIndex+1);
            index = token.endIndex + 1;
        }

        const result = new LanguageTokeniserResult(tokens);
        return result;
    }

    private isDigit (character) {
        return digits.includes(character);
    }

    private isLetter(character) {
        return character.toLowerCase() != character.toUpperCase();
    }

    private processFromNewToken(characterIndex:number, tokens:LanguageToken[], text:string):LanguageToken {
            const character = text[characterIndex];

            if (this.isLetter(character)) {
                const token = new LanguageToken();
                token.startIndex = characterIndex;
                token.lowLevelType = lowLevelTokenType.word;
                tokens.push(token);
                return this.processWord(characterIndex+1, token, tokens, text,true );
            } else if (this.isDigit(character)){
                const token = new LanguageToken();
                token.startIndex = characterIndex;
                token.lowLevelType = lowLevelTokenType.word;
                tokens.push(token);
                return this.processWord(characterIndex+1, token,tokens, text,false)  
            } else if (character == '\n' || character == '\r') {
                const token = new LanguageToken();
                token.startIndex = token.endIndex = characterIndex;
                token.lowLevelType = lowLevelTokenType.control;
                tokens.push(token);
                return token;
            } else if (character == ' ' || character == '\t') {
                const token = new LanguageToken();
                token.startIndex = token.endIndex = characterIndex;
                token.lowLevelType = lowLevelTokenType.whitespace;
                tokens.push(token);
                return token;
            } else { // its a 'symbol'
                const token = new LanguageToken();
                token.startIndex = token.endIndex = characterIndex;
                token.lowLevelType = lowLevelTokenType.symbol;
                tokens.push(token);
                return token;
            }
    }

    private processWord(characterIndex:number, currentToken:LanguageToken, tokens:LanguageToken[], text:string, lastWasLetter:boolean) {
        if (characterIndex < text.length) {
            const character = text[characterIndex];

            if (this.isDigit(character)) {
                if (lastWasLetter) {
                    currentToken.letterDigitSwapCount++; 
                }
                return this.processWord(characterIndex+1, currentToken, tokens, text, false);
            } else if (this.isLetter(character)) {
                if (!lastWasLetter) {
                    currentToken.letterDigitSwapCount++; 
                }
                return this.processWord(characterIndex+1, currentToken, tokens, text, true);
                
            } else { // Not a letter or digit so the word is over
                currentToken.endIndex = characterIndex-1;
                return currentToken;
            }
        } else {
            currentToken.endIndex = text.length - 1;
        }
        
        return currentToken;
    }

}
