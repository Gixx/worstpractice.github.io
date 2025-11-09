/**
 * Data Storage component.
 *
 * @returns {*}
 */
const LocalStorage = function ()
{
    /** @instance Utility */
    let utility = globalThis.Components.get('utility')
    /** @instance Logger */
    let logger = new Logger('Data Storage', 'SpringGreen');
    /** @type {object} */
    const storage = {};

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    if (typeof(Storage) === 'undefined') {
        throw new ReferenceError('Your browser does not support the local/session storage feature.');
    }

    /**
     * Initialize component
     */
    const initialize = function()
    {
        initStorageKeys(localStorage);
        initStorageKeys(sessionStorage);

        utility.triggerEvent(document, 'Component.DataStorage.Ready', null, 1);
    };

    /**
     * Fills up the registry.
     *
     * @param storageEngine
     */
    const initStorageKeys = function(storageEngine)
    {
        const storageKeys = Object.keys(storageEngine);
        let i = storageKeys.length;

        while (i--) {
            storage[storageKeys[i]] = storageEngine;
        }
    };

    /**
     * Set data.
     *
     * @param {string} key      The name of the key
     * @param {string} value    The value
     * @param {boolean} session Mark it as session data (for the logging only)
     */
    const setData = function (key, value, session = false)
    {
        //logger.actionTriggered('Setting data into dataStorage', key + (session ? ' (session)' : '') + ': "'+value+'"');
        typeof storage[key] !== 'undefined' && storage[key].setItem(key, value);
    };

    /**
     * Retrieve data by key.
     *
     * @param {string} key The name of the key
     * @returns {string}
     */
    const getDataByKey = function (key)
    {
        return typeof storage[key] !== 'undefined'
            ? storage[key].getItem(key)
            : '';
    };

    /**
     * Delete data by key.
     *
     * @param {string} key The name of the key
     */
    const deleteDataByKey = function(key)
    {
        typeof storage[key] !== 'undefined' && storage[key].removeItem(key);
    };

    logger.componentLoaded();
    initialize();

    return {
        /**
         * Set data.
         *
         * @param {string} key   The name of the key
         * @param {string} value The value
         * @param {boolean} session The data should be deleted when the browser session ends.
         */
        set: function (key, value, session = false) {
            // To avoid to leave mess in local storage when setting an existing key to session storage, first we delete.
            deleteDataByKey(key);

            storage[key] = session ? sessionStorage : localStorage;

            setData(key, value, session);
        },

        /**
         * Retrieve data by key.
         *
         * @param {string} key The name of the key
         * @returns {string}
         */
        get: function (key) {
            return getDataByKey(key);
        },

        /**
         * Renew a data if exists.
         * No real use. Its only purpose is to be compatible with the CookieStorage.
         *
         * @param {string} key The name of the key
         * @param {boolean} session The data should be deleted when the browser session ends.
         */
        renew: function(key, session = false) {
            const value = getDataByKey(key);

            if (value !== '') {
                this.set(key, value, session);
            }
        },

        /**
         * Delete data by key.
         *
         * @param {string} key The name of the key
         */
        delete: function(key) {
            deleteDataByKey(key);
        },
    }
};

window['LocalStorage'] = LocalStorage;