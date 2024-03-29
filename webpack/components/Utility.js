/**
 * Utility component.
 *
 * @param {boolean} verbose
 * @returns {*}
 */
const Utility = function ({verbose = false})
{
    /** @type {string} */
    const consoleColorId = '#D7CFFF';

    /**
     * Converts a form data to object
     *
     * @param {FormData} formData
     * @return {Object}
     */
    const formDataToObject = function ({formData})
    {
        const object = {};

        formData.forEach(function (value, key) {
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
    const objectToFormData = function ({object})
    {
        const formData = new FormData();

        for (let attribute in object) {
            if (object.hasOwnProperty(attribute)) {
                formData.append(attribute, object[attribute]);
            }
        }

        return formData
    };

    /**
     * Initialize component
     */
    const initialize = function()
    {
        triggerEvent(document, 'Component.Utility.Ready');
    };

    /**
     * Makes an XmlHttpRequest.
     *
     * @param {string} url
     * @param {string} method
     * @param {boolean} async
     * @param {string} enctype
     * @param {FormData|object} data
     * @param {null|function} successCallback
     * @param {null|function} failureCallback
     * @returns {XMLHttpRequest}
     */
    const doXmlHttpRequest = function(url, method, async, enctype, data, successCallback, failureCallback)
    {
        const rnd = new Date().getTime();
        url = url + (url.lastIndexOf('?') === -1 ? '?' : '&') + 'timestamp=' + rnd;

        const xhr = new XMLHttpRequest();
        xhr.open(method, url, async);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                try {
                    if (xhr.status === 200) {
                        successCallback(xhr.responseText);
                    } else {
                        failureCallback(xhr.responseText);
                    }
                } catch (exp) {
                    verbose && console.warn('JSON parse error. Continue', exp);
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
                data = Object.keys(data).map(function (key) {
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
    };

    /**
     * Fetches a URL
     *
     * @param {string} url
     * @param {string} method
     * @param {boolean} async
     * @param {string} enctype
     * @param {FormData|object} data
     * @param {null|function} successCallback
     * @param {null|function} failureCallback
     */
    const doFetch = function(url, method, async, enctype, data, successCallback, failureCallback)
    {
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

                data = Object.keys(data).map(function (key) {
                    return key + '=' + data[key];
                }).join('&');
                break;

            case 'multipart/form-data':
                if (!(data instanceof FormData)) {
                    data = objectToFormData(data);
                }
                break;
        }

        const request = {
            method: method,
            headers: {
                'Content-Type': enctype,
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        if (method !== 'GET' && method !== 'HEAD') {
            request.body = data;
        }

        verbose && console.info(
            '%c[Utility]%c ⚡%c Fetching URL %o',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:orange;font-weight:bold',
            'color:#599bd6',
            url
        );

        fetch(url, request)
            .then(function (response) {
                if (response.ok) {
                    successCallback(response);
                } else {
                    const error = new Error(response.statusText || response.status);
                    error.response = response;
                    throw error
                }
            })
            .catch(function (err) {
                failureCallback(err);
            });
    };

    /**
     * Triggers an event on an element.
     *
     * @param {*}       element
     * @param {string}  eventName
     * @param {*}       [customData]
     */
    const triggerEvent = function (element, eventName, customData)
    {
        let event;

        if (customData !== null) {
            event = new CustomEvent(eventName, {'detail': customData})
        } else {
            event = new Event(eventName);
        }

        verbose && console.info(
            '%c[Utility]%c ⚡%c Triggering event: %o',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:orange;font-weight:bold',
            'color:#599bd6',
            eventName
        );

        element.dispatchEvent(event);
    };

    /**
     * Returns the event element path.
     *
     * @param {Event} event
     * @return {Array}
     */
    const getEventPath = function (event)
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

        function getParents(node, memo)
        {
            memo = memo || [];
            const parentNode = node.parentNode;

            if (!parentNode) {
                return memo;
            } else {
                return getParents(parentNode, memo.concat([parentNode]));
            }
        }

        return [target]
            .concat(getParents(target))
            .concat([window]);
    };

    /**
     * Tries to figure out the operating system
     *
     * @returns {string}
     */
    const getDeviceOs = function()
    {
        let operatingSystem = 'Unknown';
        const patterns = ['Win', 'Mac', 'X11', 'Linux', 'iPhone', 'iPad', 'Android'];
        const supportedOperatingSystems = ['Windows', 'MacOS', 'Unix', 'Linux', 'iOS', 'iOS', 'Android'];

        for (let i in patterns) {
            if (navigator.platform.indexOf(patterns[i]) !== -1) {
                operatingSystem = supportedOperatingSystems[i];
            }
        }

        return operatingSystem;
    };

    verbose && console.info(
        '%c[Utility]%c ✔%c The Utility Component loaded.',
        'background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    initialize();

    return {
        /**
         * Makes an XmlHttpRequest.
         *
         * @param {string} url
         * @param {string} method
         * @param {boolean} async
         * @param {string} enctype
         * @param {FormData|object} data
         * @param {null|function} successCallback
         * @param {null|function} failureCallback
         * @returns {XMLHttpRequest}
         */
        ajax : function ({url = '/', method = 'POST', async = true, enctype = 'application/json', data = {}, successCallback = null, failureCallback = null}) {
            if (typeof successCallback !== 'function') {
                successCallback = function (data) {};
            }

            if (typeof failureCallback !== 'function') {
                failureCallback =  function (data) {};
            }

            return doXmlHttpRequest(url, method, async, enctype, data, successCallback, failureCallback);
        },

        /**
         * Fetches a URL
         *
         * @param {string} url
         * @param {string} method
         * @param {boolean} async
         * @param {string} enctype
         * @param {FormData|object} data
         * @param {null|function} successCallback
         * @param {null|function} failureCallback
         */
        fetch: function ({url = '/', method = 'POST', async = true, enctype = 'application/json', data = {}, successCallback = null, failureCallback = null}) {
            if (typeof successCallback !== 'function') {
                successCallback = function (data) {};
            }

            if (typeof failureCallback !== 'function') {
                failureCallback =  function (data) {};
            }

            return doFetch(url, method, async, enctype, data, successCallback, failureCallback);
        },

        /**
         * Triggers an event on an element.
         *
         * @param {*}   element
         * @param {string} eventName
         * @param {*}      [customData]
         */
        triggerEvent : function ({element, eventName, customData = null}) {
            triggerEvent(element, eventName, customData);
        },

        /**
         * Returns the event element path.
         *
         * @param {Event} event
         * @return {Array}
         */
        getEventPath: function ({event}) {
            return getEventPath(event);
        },

        /**
         * Tries to figure out the operating system
         *
         * @returns {string}
         */
        getDeviceOs: function () {
            return getDeviceOs();
        }
    };
};

window['Utility'] = Utility;
