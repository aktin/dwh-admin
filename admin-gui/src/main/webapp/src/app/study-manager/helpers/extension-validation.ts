/**
 * Framework-free rule engine for validating a patient reference "extension".
 *
 * The rules were extracted from {@link ExtensionValidatorDirective} so that the exact same
 * format checks can run both in the single-patient form (via the directive) and in the bulk
 * grid ({@link PatientsTextAreaComponent}), which edits the extension inside ag-Grid cells and
 * therefore cannot use Angular form-control directives.
 *
 * Adding a new rule (e.g. "no whitespace", "no special characters") is a single entry in
 * {@link EXTENSION_RULES}.
 */

export interface ExtensionPrefs {
    /** Character that separates root from extension (path syntax). */
    separator: string;
    /** Fixed root; when empty the root is derived from the value by splitting on the separator. */
    root: string;
}

/** Defaults matching the historic directive behaviour: single slash separator, no fixed root. */
export const DEFAULT_EXTENSION_PREFS: ExtensionPrefs = {separator: '/', root: ''};

/**
 * A single format rule. {@link ExtensionRule.test} returns `true` when the rule is VIOLATED.
 * {@link ExtensionRule.key} is the stable identifier reused as the Angular `ValidationErrors`
 * key in the single-patient form and mapped to an `EntryValidation` for the bulk grid.
 */
export interface ExtensionRule {
    key: string;
    test: (value: string, prefs: ExtensionPrefs) => boolean;
}

/**
 * Splits a value into root and extension based on the preferences, mirroring the original
 * directive logic: with a fixed root the whole value is the extension; otherwise the value is
 * split on the first separator (no separator => the value is the root and the extension empty).
 */
export function splitExtension(value: string, prefs: ExtensionPrefs): { root: string; ext: string } {
    if (prefs.root.length !== 0) {
        return {root: prefs.root, ext: value};
    }
    if (value.includes(prefs.separator)) {
        return {
            root: value.split(prefs.separator)[0],
            ext: value.slice(value.indexOf(prefs.separator) + 1),
        };
    }
    return {root: value, ext: ''};
}

const RESERVED_PERIODS = ['.', '..'];

/**
 * Ordered set of format rules. Each rule is guarded by its own preconditions, so collecting
 * every violation is safe (the guards keep mutually exclusive rules from firing together).
 * Extend this list to introduce new rules.
 */
export const EXTENSION_RULES: ExtensionRule[] = [
    {
        // maximal one slash as separator if root is not set in properties
        key: 'slashSep',
        test: (value, prefs) =>
            prefs.separator === '/' && prefs.root === '' && (value.match(/\//g)?.length ?? 0) > 1,
    },
    {
        // separator not as first character if root is not set in properties
        key: 'separator',
        test: (value, prefs) => prefs.root === '' && value.startsWith(prefs.separator),
    },
    {
        // value of root and extension may not be . or .. (reserved for path syntax)
        key: 'period',
        test: (value, prefs) => {
            const {root, ext} = splitExtension(value, prefs);
            return RESERVED_PERIODS.includes(ext) || RESERVED_PERIODS.includes(root);
        },
    },
    {
        // no line breaks / carriage returns (e.g. leftovers from spreadsheet paste)
        key: 'lineBreak',
        test: value => /[\r\n]/.test(value),
    },
    {
        // no spaces, tabs, or other whitespace within an extension
        // CR/LF are handled by the dedicated lineBreak rule above.
        key: 'whitespace',
        test: value => /[^\S\r\n]/.test(value),
    },
];

/**
 * Returns the keys of all violated rules in rule order, or an empty array when the value is
 * valid. An empty/nullish value is treated as valid (presence is enforced elsewhere).
 */
export function validateExtension(
    value: string,
    prefs: ExtensionPrefs = DEFAULT_EXTENSION_PREFS,
): string[] {
    if (!value) {
        return [];
    }
    return EXTENSION_RULES.filter(rule => rule.test(value, prefs)).map(rule => rule.key);
}
