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
    const SOME_CONSTANT = 1;

    /** @type {number} */
    let readWriteProperty;

    /**
     * Generate a valid UUID
     * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
     *
     * @return {string}
     */
    this.generateUUID = function()
    {
        // M is the uuid version
        // N is the high bits of clock sequence according to rfc4122
        const uuidTemplate = 'xxxxxxxx-xxxx-!xxx-?xxx-xxxxxxxxxxxx'.split('');
        const uuidVersion = '4';
        let uuidVariant, i, random;
        const uuid = [];

        for (i = 0; i < uuidTemplate.length; i++) {
            random = 0 | Math.random() * 16;
            uuidVariant = (random & 0x3)  | 0x8;

            uuid[i] = uuidTemplate[i]
                .replace(/[^\-\!\?]/, AVAILABLE_CHARACTERS[random])
                .replace('!', uuidVersion)
                .replace('?', AVAILABLE_CHARACTERS[uuidVariant]);
        }
        return uuid.join('');
    };

    /**
     * Gets the read-only property.
     *
     * @returns {string}
     */
    this.getNilUUID = function()
    {
        return nilUUID;
    };

    /**
     * Gets the read-write property.
     *
     * @returns {number}
     */
    this.getReadWrite = function()
    {
        return readWriteProperty;
    };

    /**
     * Sets the read-write property.
     *
     * @param {*} value Accepts only Integers
     */
    this.setReadWrite = function(value)
    {
        if (isNaN(value)) {
            throw new ReferenceError('Parameter 1 expected to be an integer, ' + (typeof value) + ' given.');
        }

        readWriteProperty = parseInt(value);
    };

    /**
     * Resets the read-write property to its initial state.
     */
    this.resetReadWrite = function()
    {
        // Just an example how the public stuff reach each other.
        this.setReadWrite(SOME_CONSTANT);
    };
};

window['MyClass'] = MyClass;
