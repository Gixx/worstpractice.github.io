/**
 * @returns {string|Readonly<{readonly, nilUUID: Object.nilUUID, generateUUID: (function(*=): string)}>}
 * @constructor
 */
const MyClass2 = function()
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

    /**
     * Collection of public properties
     * @type {Object}
     * @private
     */
    const properties = {
        nilUUID: getNilUUID(),
    };

    /**
     * Collection of public methods including setters and getters for public properties.
     *
     * @type {{readonly nilUUID: Object.nilUUID, generateUUID: (function(*=): string)}}
     */
    const methods = {
        set nilUUID(newValue) {
            properties.nilUUID = newValue;
        },

        get nilUUID() {
            return properties.nilUUID;
        },

        /**
         * Generate and return a valid UUID
         *
         * @returns {string}
         */
        generateUUID: function(isNilUUID = false)
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
        }
    };

    return Object.freeze(methods);
};

window['MyClass2'] = MyClass2;

const myObj2 = new MyClass2();
