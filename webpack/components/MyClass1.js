/**
 * @typedef {Object} MyClass1
 * @property {function(): string} generateUUID
 * @property {string} nilUUID
 */

/**
 * @constructor
 */
const MyClass1 = function()
{
    /** @type {array} */
    const AVAILABLE_CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    /** @type {array} */
    const uuidTemplate = 'xxxxxxxx-xxxx-!xxx-?xxx-xxxxxxxxxxxx'.split('');

    /** @type {string} */
    const uuidVersion = '4';

    /**
     * Gets the read-only property.
     *
     * @returns {string}
     */
    const getNilUUID = function()
    {
        return '00000000-0000-0000-0000-000000000000';
    };

    /** @type {string} */
    this.nilUUID = getNilUUID();

    /**
     * Generate a valid UUID
     * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
     *
     * @return {string}
     */
    this.generateUUID = function(isNilUUID = false)
    {
        if (isNilUUID) {
            return this.nilUUID;
        }

        let uuidVariant, i, random;
        const uuid = [];

        for (i = 0; i < uuidTemplate.length; i++) {
            random = 0 | Math.random() * 16;
            uuidVariant = (random & 0x3)  | 0x8;

            uuid[i] = uuidTemplate[i]
                .replace(/[^\-\!\?]/, AVAILABLE_CHARACTERS[random])
                // ! is the uuid version
                .replace('!', uuidVersion)
                // ? is the high bits of clock sequence according to rfc4122
                .replace('?', AVAILABLE_CHARACTERS[uuidVariant]);
        }
        return uuid.join('');
    };
};

window['MyClass1'] = MyClass1;

const myObj1 = new MyClass1();
