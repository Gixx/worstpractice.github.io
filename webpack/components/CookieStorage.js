/**
 * Cookie Storage component.
 *
 * @param {object} utility
 * @param {boolean} verbose
 * @returns {*}
 * @constructor
 */
const CookieStorage = function ({utility, verbose = false})
{
    const MAX_COOKIE_EXPIRATION_DAYS = 7;
    /** @type {string} */
    let consoleColorId = '#606366';

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /**
     * Initialize component
     */
    let initialize = function()
    {
        utility.triggerEvent({element: document, eventName: 'Component.Cookie.Ready'});
    };

    /**
     * Set a cookie.
     *
     * @param {string} cookieName  The name of the cookie
     * @param {string} cookieValue The value of the cookie
     * @param {number} expirationDays Expiration days
     * @param {boolean} standardLog Whether to log the standard info or not
     */
    let setCookie = function (cookieName, cookieValue, expirationDays, standardLog = true)
    {
        let date = new Date();
        date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
        let expires = "expires="+ date.toUTCString();

        standardLog && verbose && console.info(
            '%c[Cookie Storage]%c ⚡%c Setting Cookie : %o',
            'color:white;background:'+consoleColorId+';font-weight:bold;',
            'color:orange;font-weight:bold',
            'color:#599bd6',
            cookieName
        );
        document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';secure' : '');
    };

    /**
     * Retrieve a cookie value.
     *
     * @param {string} cookieName The name of the cookie
     * @returns {string}
     */
    let getCookie = function (cookieName)
    {
        let name = cookieName + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let cookieArray = decodedCookie.split(';');

        for (let i = 0, num = cookieArray.length; i < num; i++) {
            let cookie = cookieArray[i];
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
    let renewCookie = function(cookieName, expirationDays)
    {
        let cookieValue = getCookie(cookieName);
        if (cookieValue !== '') {
            verbose && console.info(
                '%c[Cookie Storage]%c ⚡%c Renew Cookie : %o',
                'color:white;background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                cookieName
            );

            setCookie(cookieName, cookieValue, expirationDays, false);
        }
    };

    /**
     * Delete a cookie if exists.
     *
     * @param {string} cookieName The name of the cookie
     */
    let deleteCookie = function(cookieName)
    {
        let cookieValue = getCookie(cookieName);

        if (cookieValue !== '') {
            verbose && console.info(
                '%c[Cookie Storage]%c ⚡%c Delete Cookie : %o',
                'color:white;background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                cookieName
            );

            setCookie(cookieName, '', -1);
        }
    };

    verbose && console.info(
        '%c[Cookie Storage]%c ✔%c The Cookie Component loaded.',
        'color:white;background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    initialize();

    return {
        constructor: CookieStorage,

        /**
         * Set a cookie.
         *
         * @param {string} key  The name of the cookie
         * @param {string} value The value of the cookie
         * @param {boolean} session The data should be deleted when the browser session ends.
         */
        set: function ({key, value, session = false}) {
            let expirationDays = session ? 0 : MAX_COOKIE_EXPIRATION_DAYS;

            setCookie(key, value, expirationDays);
        },

        /**
         * Retrieve a cookie value.
         *
         * @param {string} key The name of the cookie
         * @returns {string}
         */
        get: function ({key}) {
            return getCookie(key);
        },

        /**
         * Renew a cookie if exists.
         *
         * @param {string} key The name of the cookie
         * @param {boolean} session The data should be deleted when the browser session ends.
         */
        renew: function({key, session = false}) {
            let expirationDays = session ? 0 : MAX_COOKIE_EXPIRATION_DAYS;

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
