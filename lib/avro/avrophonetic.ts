import data from './avro.data';

interface RuleMatch {
    type: string;
    scope: string;
    negative?: boolean;
    value?: string;
}

interface Pattern {
    find: string;
    replace: string;
    rules?: Rule[];
}

interface Rule {
    matches: RuleMatch[];
    replace: string;
}

interface AvroPhoneticProps {
    input: string;
}

function AvroPhonetic(props: AvroPhoneticProps): string {
    const { input } = props;

    function fixString(input: string): string {
        let fixed = '';
        for (let i = 0; i < input.length; ++i) {
            const cChar = input.charAt(i);
            if (isCaseSensitive(cChar)) {
                fixed += cChar;
            } else {
                fixed += cChar.toLowerCase();
            }
        }
        return fixed;
    }

    function isVowel(c: string): boolean {
        return data.vowel.includes(c.toLowerCase());
    }

    function isConsonant(c: string): boolean {
        return data.consonant.includes(c.toLowerCase());
    }

    function isPunctuation(c: string): boolean {
        return !(isVowel(c) || isConsonant(c));
    }

    function isExact(needle: string, haystack: string, start: number, end: number, not: boolean): boolean {
        return (start >= 0 && end < haystack.length && (haystack.substring(start, end) === needle)) !== not;
    }

    function isCaseSensitive(c: string): boolean {
        return data.casesensitive.includes(c.toLowerCase());
    }

    const fixed = fixString(input);
    let output = '';

    for (let cur = 0; cur < fixed.length; ++cur) {
        let start = cur, end = cur + 1, prev = start - 1;
        let matched = false;

        for (let i = 0; i < data.patterns.length; ++i) {
            const pattern = data.patterns[i];
            end = cur + pattern.find.length;

            if (end <= fixed.length && fixed.substring(start, end) === pattern.find) {
                prev = start - 1;

                if (pattern.rules !== undefined) {
                    for (let j = 0; j < pattern.rules.length; ++j) {
                        const rule = pattern.rules[j];
                        let replace = true;
                        let chk = 0;

                        for (let k = 0; k < rule.matches.length; ++k) {
                            const match = rule.matches[k];

                            if (match.type === "suffix") {
                                chk = end;
                            } else {
                                chk = prev;
                            }

                            // Check if 'negative' is defined before accessing it
                            let isNegative = typeof match === 'object' && 'negative' in match ? match.negative : false;


                            let e: number;
                            if (match.scope === "punctuation") {
                                // ... (other cases)
                            } else if (match.scope === "exact") {
                                let s: number; // Declare 's' as a 'let' variable
                                if (match.type === "suffix") {
                                    s = end;
                                    e = end + (match.value ? match.value.length : 0); // Check if 'match.value' exists before accessing its length
                                } else {
                                    s = start - (match.value ? match.value.length : 0); // Check if 'match.value' exists before accessing its length
                                    e = start;
                                }
                                if (!isExact(match.value || '', fixed, s, e, typeof isNegative === 'boolean' ? isNegative : false)) {
                                    replace = false;
                                    break;
                                }

                            }
                        }

                        if (replace) {
                            output += rule.replace;
                            cur = end - 1;
                            matched = true;
                            break;
                        }
                    }
                }

                if (matched) break;
                output += pattern.replace;
                cur = end - 1;
                matched = true;
                break;
            }
        }

        if (!matched) {
            output += fixed.charAt(cur);
        }
    }

    return output;
}

export default AvroPhonetic;
