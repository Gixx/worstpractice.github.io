/**
 * @returns {Readonly<{generateUUID: (function(*=): string)}>}
 * @constructor
 */
const MyClass1 = function()
{
    /** @type {array} */
    const AVAILABLE_CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    /** @type {string} Nil UUID */
    const nilUUID = '00000000-0000-0000-0000-000000000000';

    /** @type {array} */
    const uuidTemplate = 'xxxxxxxx-xxxx-!xxx-?xxx-xxxxxxxxxxxx'.split('');

    /** @type {string} */
    const uuidVersion = '4';

    /**
     * Generate a valid UUID
     * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
     *
     * @return {string}
     */
    const generateUUID = function()
    {
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

    /**
     * @type {{generateUUID: (function(*=): string)}}
     */
    const __ = {
        /**
         * Generate and return a valid UUID
         *
         * @returns {string}
         */
        generateUUID: function(isNilUUID = false)
        {
            return isNilUUID ? nilUUID : generateUUID();
        }
    };

    return Object.freeze(__);
};

window['MyClass1'] = MyClass1;

const myObj1 = new MyClass1();