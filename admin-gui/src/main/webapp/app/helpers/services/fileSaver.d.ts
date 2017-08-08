// Type definitions for FileSaver.js
// Project: https://github.com/eligrey/FileSaver.js/
// Definitions by: Cyril Schumacher <https://github.com/cyrilschumacher>, Daniel Roth <https://github.com/DaIgeb>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 * @summary Interface for "saveAs" function.
 * @author  Cyril Schumacher
 * @version 1.0
 */
declare module 'file-saver' {
    export = saveAs;
}

declare let saveAs: FileSaver;
interface FileSaver {
    (
        /**
         * @summary Data.
         * @type {Blob}
         */
        data: Blob,

        /**
         * @summary File name.
         * @type {DOMString}
         */
        filename: string,

        /**
         * @summary Disable Unicode text encoding hints or not.
         * @type {boolean}
         */
        disableAutoBOM?: boolean
    ): void

    (
        /**
         * @summary File.
         * @type {File}
         */
        data: File
    ): void
}


