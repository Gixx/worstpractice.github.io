
/**
 * Http component.
 *
 * @returns {*}
 */
const Http = function ()
{
    /** @instance Utility */
    let utility = globalThis.Components.get('utility')
    /** @instance Logger */
    let logger = new Logger('Http', 'GreenYellow');

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /**
     * Initializes the component and collects the elements.
     */
    const initialize = function ()
    {
        utility.triggerEvent(document, 'Component.Http.Ready', null, 1);
    };

    logger.componentLoaded();

    initialize();

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
                    logger.warn('JSON parse error. Continue', exp);
                }
            }
        };

        // if NOT multipart/form-data, turn the FromData into object
        if (data instanceof FormData && enctype !== 'multipart/form-data') {
            data = utility.formDataToObject(data);
        }

        // if mulitpart/form-data, turn the data into FormData
        if (!data instanceof FormData && enctype === 'multipart/form-data') {
            data = utility.objectToFormData(data);
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
     * @return Promise
     */
    const doFetch = function(url, method, async, enctype, data, successCallback, failureCallback)
    {
        switch (enctype) {
            case 'application/json':
                if (data instanceof FormData) {
                    data = utility.formDataToObject(data);
                }

                data = JSON.stringify(data);
                break;

            case 'application/x-www-form-urlencoded':
                if (data instanceof FormData) {
                    data = utility.formDataToObject(data);
                }

                data = Object.keys(data).map(function (key) {
                    return key + '=' + data[key]
                }).join('&');
                break;

            case 'multipart/form-data':
                if (!data instanceof FormData) {
                    data = utility.objectToFormData(data);
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

        logger.actionTriggered('Fetching URL', url);

        return fetch(url, request)
            .then(function (response) {
                if (response.ok) {
                    logger.actionSuccess('URL fetch successful', url)
                    return successCallback(response);
                } else {
                    return failureCallback(response);
                }
            })
            .catch(function (){
                logger.actionFailed('URL fetch failed', url)
            });
    };

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
        ajax : function (url = '/', method = 'POST', async = true, enctype = 'application/json', data = {}, successCallback = null, failureCallback = null) {
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
         * @return Promise
         */
        fetch: function (url = '/', method = 'POST', async = true, enctype = 'application/json', data = {}, successCallback = null, failureCallback = null) {
            if (typeof successCallback !== 'function') {
                successCallback = function (data) {
                    return new Promise((resolve, reject) => {
                        resolve(data);
                    });
                };
            }

            if (typeof failureCallback !== 'function') {
                failureCallback =  function (data) {
                    return new Promise((resolve, reject) => {
                        reject(data);
                    });
                };
            }

            return doFetch(url, method, async, enctype, data, successCallback, failureCallback);
        }
    };
};

window['Http'] = Http;