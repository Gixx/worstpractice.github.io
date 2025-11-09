/**
 * Cookie Storage component.
 *
 * @returns {*}
 */
const CookieStorage = function ()
{
    const MAX_COOKIE_EXPIRATION_DAYS = 7;

    /** @instance Utility */
    let utility = globalThis.Components.get('utility')
    /** @instance Logger */
    let logger = new Logger('Cookie Storage', 'SpringGreen');

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /**
     * Initialize component
     */
    const initialize = function()
    {
        utility.triggerEvent(document, 'Component.Cookie.Ready', null, 1);
    };

    /**
     * Set a cookie.
     *
     * @param {string} cookieName  The name of the cookie
     * @param {string} cookieValue The value of the cookie
     * @param {number} expirationDays Expiration days
     * @param {boolean} standardLog Whether to log the standard info or not
     */
    const setCookie = function (cookieName, cookieValue, expirationDays, standardLog = true)
    {
        const date = new Date();
        date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        const expires = "expires="+ date.toUTCString();

        standardLog && logger.actionTriggered('Setting Cookie', cookieValue);
        document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';secure' : '');
    };

    /**
     * Retrieve a cookie value.
     *
     * @param {string} cookieName The name of the cookie
     * @returns {string}
     */
    const getCookie = function (cookieName)
    {
        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        let cookie, i, num;

        for (i = 0, num = cookieArray.length; i < num; i++) {
            cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }

        return '';
    };

    /**
     * Renew a cookie if exists.
     *
     * @param {string} cookieName The name of the cookie
     * @param {number} expirationDays Expiration days of the cookie
     */
    const renewCookie = function(cookieName, expirationDays)
    {
        const cookieValue = getCookie(cookieName);

        if (cookieValue !== '') {
            logger.actionTriggered('Renew Cookie', cookieName);
            setCookie(cookieName, cookieValue, expirationDays, false);
        }
    };

    /**
     * Delete a cookie if exists.
     *
     * @param {string} cookieName The name of the cookie
     */
    const deleteCookie = function(cookieName)
    {
        if (getCookie(cookieName) !== '') {
            logger.actionTriggered('Delete Cookie', cookieName);
            setCookie(cookieName, '', -1);
        }
    };

    logger.componentLoaded();

    initialize();

    return {
        /**
         * Set a cookie.
         *
         * @param {string} key  The name of the cookie
         * @param {string} value The value of the cookie
         * @param {boolean} session The data should be deleted when the browser session ends.
         */
        set: function (key, value, session = false) {
            const expirationDays = session ? 0 : MAX_COOKIE_EXPIRATION_DAYS;

            setCookie(key, value, expirationDays);
        },

        /**
         * Retrieve a cookie value.
         *
         * @param {string} key The name of the cookie
         * @returns {string}
         */
        get: function (key) {
            return getCookie(key);
        },

        /**
         * Renew a cookie if exists.
         *
         * @param {string} key The name of the cookie
         * @param {boolean} session The data should be deleted when the browser session ends.
         */
        renew: function(key, session = false) {
            const expirationDays = session ? 0 : MAX_COOKIE_EXPIRATION_DAYS;

            renewCookie(key, expirationDays);
        },

        /**
         * Delete a cookie if exists.
         *
         * @param {string} key The name of the cookie
         */
        delete: function(key) {
            deleteCookie(key);
        },
    }
};

window['CookieStorage'] = CookieStorage;