import { LanguageTokeniser } from './index';

test('basic tokenisation of words and whitespace', () => {
    const tokeniser = new LanguageTokeniser();

    const result = tokeniser.process('the cat sat on the mat');

    expect(result.tokens.length).toBe(11);
});

test('word can start with a digit', () => {
    const tokeniser = new LanguageTokeniser();

    const result = tokeniser.process('1direction');

    expect(result.tokens.length).toBe(1);
    expect(result.tokens[0].lowLevelType).toBe(LanguageTokeniser.lowLevelTokenType.word);
});

test('basic symbol processing', () => {
    const tokeniser = new LanguageTokeniser();

    const result = tokeniser.process('Bang!');

    expect(result.tokens.length).toBe(2);
    expect(result.tokens[1].lowLevelType).toBe(LanguageTokeniser.lowLevelTokenType.symbol);
    expect(result.tokens[1].text).toBe('!');
});

test('basic control character parsing', () => {
    const tokeniser = new LanguageTokeniser();

    const result = tokeniser.process('line1\nline2');

    expect(result.tokens.length).toBe(3);
    expect(result.tokens[1].lowLevelType).toBe(LanguageTokeniser.lowLevelTokenType.control);
    expect(result.tokens[1].text).toBe('\n');
});


test('letter-digit digit-letter counting', () => {
    const tokeniser = new LanguageTokeniser();

    const result = tokeniser.process('ab34cd56 <- this is a reference');

    expect(result.tokens[0].letterDigitSwapCount).toBe(3);
});
