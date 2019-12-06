/**
 * Util component
 *
 * @type {{init: Util.init, getEventPath: Util.getEventPath, fetch: Util.fetch, getDeviceOs: (function(): string), triggerEvent: Util.triggerEvent, setCookie: Util.setCookie, ajax: (function(*): XMLHttpRequest), getCookie: Util.getCookie, addEventListeners: Util.addEventListeners}}
 */
const Util = function(options)
{
    "use strict";

    /** @type {boolean} */
    let initialized = false;
    /** @type {string} */
    let consoleColorId = '#d7cfff';

    if (typeof options.verbose === 'undefined') {
        options.verbose = true;
    }

    options.verbose && console.info(
        '%c[Util]%c ✔%c The Util Component loaded.',
        'background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    /**
     * Converts a form data to object
     *
     * @param {FormData} formData
     * @return {Object}
     */
    let formDataToObject = function(formData)
    {
        let object = {};

        formData.forEach(function(value, key){
            object[key] = value;
        });

        return object;
    };

    /**
     * Converts an object to form data
     *
     * @param {Object} object
     * @return {FormData}
     */
    let objectToFormData = function(object)
    {
        let formData = new FormData();

        for (let attribute in object) {
            if (object.hasOwnProperty(attribute)) {
                formData.append(attribute, object[attribute]);
            }
        }

        return formData
    };

    return {
        /**
         * Initializes the component.
         */
        init : function ()
        {
            initialized = true;
            this.triggerEvent(document, 'Component.Util.Ready');
        },

        /**
         * Makes an XmlHttpRequest.
         *
         * @param {*} settings
         * @return {XMLHttpRequest}
         * @example  {
         *   url: '/index',
         *   method: 'POST',
         *   enctype: 'application/json',
         *   data: {
         *     name: 'John Doe',
         *     email: 'johndoe@foo.org'
         *   },
         *   async: true,
         *   success: function(data) { alert('Done'); },
         *   failure: function(data) { alert('Failed'); }
         * }
         */
        ajax : function (settings)
        {
            let rnd = new Date().getTime();
            let url = typeof settings.url !== 'undefined' ? settings.url : '/';
            let method = typeof settings.method !== 'undefined' ? settings.method : 'POST';
            let async = typeof settings.async !== 'undefined' ? settings.async : true;
            let enctype = typeof settings.enctype !== 'undefined' ? settings.enctype : 'application/json';
            let data = typeof settings.data !== 'undefined' ? settings.data : '';
            let successCallback = typeof settings.success === 'function' ? settings.success : function (data) {};
            let failureCallback = typeof settings.failure === 'function' ? settings.failure : function (data) {};
            let xhr = new XMLHttpRequest();

            url = url + (url.lastIndexOf('?') === -1 ? '?' : '&') + 'timestamp=' + rnd;

            xhr.open(method, url, async);

            xhr.onreadystatechange = function()
            {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    try {
                        if (xhr.status === 200) {
                            successCallback(xhr.responseText);
                        } else {
                            failureCallback(xhr.responseText);
                        }
                    } catch (exp) {
                        options.verbose && console.warn('JSON parse error. Continue', exp);
                    }
                }
            };

            // if NOT multipart/form-data, turn the FromData into object
            if (data instanceof FormData && enctype !== 'multipart/form-data') {
                data = formDataToObject(data);
            }

            // if mulitpart/form-data, turn the data into FormData
            if (!data instanceof FormData && enctype === 'multipart/form-data') {
                data = objectToFormData(data);
            }

            switch (enctype) {
                case 'application/json':
                    data = JSON.stringify(data);
                    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                    break;

                case 'application/x-www-form-urlencoded':
                    data = Object.keys(data).map(function(key) {
                        return key + '=' + data[key]
                    }).join('&');
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    break;

                case 'multipart/form-data':
                    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                    break;
            }

            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(data);

            return xhr;
        },

        /**
         * Fetches a URL
         *
         * @param {*} settings
         * @example {
         *   url: '/index',
         *   method: 'PUT',
         *   enctype: 'application/json',
         *   data: {
         *     name: 'John Doe',
         *     email: 'johndoe@foo.org'
         *   },
         *   success: function(data) { alert('Done'); },
         *   failure: function(data) { alert('Failed'); }
         * }
         */
        fetch: function (settings)
        {
            let url = typeof settings.url !== 'undefined' ? settings.url : '/';
            let method = typeof settings.method !== 'undefined' ? settings.method : 'POST';
            let data = typeof settings.data !== 'undefined' ? settings.data : {};
            let enctype = typeof settings.enctype !== 'undefined' ? settings.enctype : 'application/json';
            let successCallback = typeof settings.success === 'function' ? settings.success : function (data) {};
            let failureCallback = typeof settings.failure === 'function' ? settings.failure : function (data) { options.verbose && console.error(data); };

            switch (enctype) {
                case 'application/json':
                    if (data instanceof FormData) {
                        data = formDataToObject(data);
                    }

                    data = JSON.stringify(data);
                    break;

                case 'application/x-www-form-urlencoded':
                    if (data instanceof FormData) {
                        data = formDataToObject(data);
                    }

                    data = Object.keys(data).map(function(key) {
                        return key + '=' + data[key]
                    }).join('&');
                    break;

                case 'multipart/form-data':
                    if (!data instanceof FormData) {
                        data = objectToFormData(data);
                    }
                    break;
            }

            let request = {
                method: method,
                headers: {
                    'Content-Type': enctype,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            };

            if (method !== 'GET' && method !== 'HEAD') {
                request.body = data;
            }

            options.verbose && console.info(
                '%c[Util]%c Fetching URL %o',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:#cecece',
                url
            );

            fetch(url, request)
                .then(function(response) {
                    if (response.ok) {
                        successCallback(response);
                    } else {
                        let error = new Error(response.statusText || response.status);
                        error.response = response;
                        throw error
                    }
                })
                .catch(function(err) {
                    options.verbose && console.info(
                        '%c[Util]%c ⚡%c Failed to fetch URL %o',
                        'background:'+consoleColorId+';font-weight:bold;',
                        'color:orange;font-weight:bold',
                        'color:#599bd6',
                        url
                    );
                    failureCallback(err);
                });

            options.verbose && console.groupEnd();
        },

        /**
         * Adds event listeners to elements.
         *
         * @param {Array|NodeList}         elementList
         * @param {string}                 eventList
         * @param {EventListener|Function} callback
         * @param {*}                      [bindObject]
         */
        addEventListeners : function (elementList, eventList, callback, bindObject)
        {
            let events = eventList.split(' ');
            if (typeof bindObject === 'undefined') {
                bindObject = null;
            }

            if (typeof elementList.length === 'undefined') {
                elementList = [elementList];
            }

            for (let i = 0, len = events.length; i < len; i++) {
                for (let j = 0, els = elementList.length; j < els; j++) {
                    if (bindObject !== null) {
                        elementList[j].addEventListener(events[i], callback.bind(bindObject), true);
                    } else {
                        elementList[j].addEventListener(events[i], callback, true);
                    }
                }
            }
        },

        /**
         * Triggers an event on an element.
         *
         * @param {Node}   element
         * @param {string} eventName
         * @param {*}      [customData]
         */
        triggerEvent : function (element, eventName, customData)
        {
            let event;

            if (typeof customData !== 'undefined') {
                event = new CustomEvent(eventName, {'detail': customData})
            } else {
                event = new Event(eventName);
            }

            options.verbose && console.info(
                '%c[Util]%c ⚡%c Triggering event: %o',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                eventName
            );

            element.dispatchEvent(event);
        },

        /**
         * Returns the event element path.
         *
         * @param {Event} event
         * @return {Array}
         */
        getEventPath: function (event)
        {
            let path = (event.composedPath && event.composedPath()) || event.path,
                target = event.target;

            if (typeof path !== 'undefined') {
                // Safari doesn't include Window, and it should.
                path = (path.indexOf(window) < 0) ? path.concat([window]) : path;
                return path;
            }

            if (target === window) {
                return [window];
            }

            function getParents(node, memo) {
                memo = memo || [];
                let parentNode = node.parentNode;

                if (!parentNode) {
                    return memo;
                }
                else {
                    return getParents(parentNode, memo.concat([parentNode]));
                }
            }

            return [target]
                .concat(getParents(target))
                .concat([window]);
        },

        /**
         * Set a cookie.
         *
         * @param {string} cName  Cookie name
         * @param {string} cValue Cookie value
         * @param {number} exDays Expiration days
         */
        setCookie: function(cName, cValue, exDays)
        {
            let date = new Date();
            date.setTime(date.getTime() + (exDays * 24 * 60 * 60 * 1000));
            let expires = "expires="+ date.toUTCString();
            options.verbose && console.info(
                '%c[Util]%c ⚡%c Setting Cookie : %o',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                cName
            );
            document.cookie = cName + '=' + cValue + ';' + expires + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';secure' : '');
        },

        /**
         * Retrieve a cookie
         *
         * @param {string} cName Cookie name
         * @returns {string}
         */
        getCookie: function(cName)
        {
            let name = cName + "=";
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
        },

        /**
         * Tries to figure out the operating system
         *
         * @returns {string}
         */
        getDeviceOs: function()
        {
            let operatingSystem = 'Unknown';
            let patterns = ['Win', 'Mac', 'X11', 'Linux', 'iPhone', 'iPad', 'Android'];
            let supportedOperatingSystems = ['Windows', 'MacOS', 'Unix', 'Linux', 'iOS', 'iOS', 'Android'];

            for (let i in patterns) {
                if (navigator.platform.indexOf(patterns[i]) !== -1) {
                    operatingSystem = supportedOperatingSystems[i];
                }
            }

            return operatingSystem;
        }
    };
}({verbose: true});

window['Util'] = Util;
