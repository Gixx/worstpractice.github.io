/**
 * @typedef {Object} MyClass
 * @property {number} SOME_CONSTANT
 * @property {function(): string} getNilUUID
 * @property {function(): string} generateUUID
 * @property {function(): number} getReadWrite
 * @property {function(*): void} setReadWrite
 * @property {function(): void} resetReadWrite
 */

/**
 * @returns {Readonly<MyClass>}
 * @constructor
 */
const MyClass = function()
{
    /** @type {array} */
    const AVAILABLE_CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    /** @type {string} Nil UUID */
    const nilUUID = '00000000-0000-0000-0000-000000000000';

    /** @type {number} */
    let readWriteProperty;

    /**
     * Generate a valid UUID
     * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
     *
     * @return {string}
     */
    const generateUUID = function()
    {
        // M is the uuid version
        // N is the high bits of clock sequence according to rfc4122
        const uuidTemplate = 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx'.split('');
        const uuidVersion = 4;
        let uuidVariant, i, random;
        const uuid = [];

        for (i = 0; i < uuidTemplate.length; i++) {
            random = 0 | Math.random() * 16;

            switch (uuidTemplate[i]) {
                case '-':
                    uuid[i] = '-';
                    break;

                case 'M':
                    uuid[i] = uuidVersion;
                    break;

                case 'N':
                    uuidVariant = (random & 0x3)  | 0x8;
                    uuid[i] = AVAILABLE_CHARACTERS[uuidVariant];
                    break;

                default:
                    uuid[i] = AVAILABLE_CHARACTERS[random];

            }
        }
        return uuid.join('');
    };

    /**
     * @type {MyClass}
     * @private
     */
    const __ = {
        /** @type {number} */
        SOME_CONSTANT: 1,

        /**
         * Gets the read-only property.
         *
         * @returns {string}
         */
        getNilUUID: function()
        {
            return nilUUID;
        },

        /**
         * Generate and return a valid UUID
         *
         * @returns {string}
         */
        generateUUID: function()
        {
            return generateUUID();
        },

        /**
         * Gets the read-write property.
         *
         * @returns {number}
         */
        getReadWrite: function()
        {
            return readWriteProperty;
        },

        /**
         * Sets the read-write property.
         *
         * @param {*} value Accepts only Integers
         */
        setReadWrite: function(value)
        {
            if (isNaN(value)) {
                throw new ReferenceError('Parameter 1 expected to be an integer, ' + (typeof value) + ' given.');
            }

            readWriteProperty = parseInt(value);
        },

        /**
         * Resets the read-write property to its initial state.
         */
        resetReadWrite: function()
        {
            // Just an example how the public stuff reach each other.
            this.setReadWrite(this.SOME_CONSTANT);
        }
    };

    // Just an example for the init.
    readWriteProperty = __.SOME_CONSTANT;

    return Object.freeze(__);
};

window['MyClass'] = MyClass;
