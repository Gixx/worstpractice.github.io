/**
 * Utility component.
 *
 * @returns {*}
 */
const Utility = function ()
{
    /** @instance Logger */
    let logger = new Logger('Utility', 'Salmon');

    /**
     * Initialize component
     */
    const initialize = function()
    {
        setTimeout(function() { triggerEvent(document, 'Component.Utility.Ready', null) }, 1);
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

        logger.actionTriggered('Triggering event', eventName);

        element.dispatchEvent(event);
    };

    logger.componentLoaded();

    initialize();

    return {
        /**
         * Converts a form data to object
         *
         * @param {FormData} formData
         * @return {Object}
         */
        formDataToObject: function (formData)
        {
            const object = {};

            formData.forEach(function (value, key) {
                object[key] = value;
            });

            return object;
        },

        /**
         * Converts an object to form data
         *
         * @param {Object} object
         * @return {FormData}
         */
        objectToFormData: function (object)
        {
            const formData = new FormData();

            for (let attribute in object) {
                if (object.hasOwnProperty(attribute)) {
                    formData.append(attribute, object[attribute]);
                }
            }

            return formData
        },

        /**
         * Triggers an event on an element.
         *
         * @param {*}      element
         * @param {string} eventName
         * @param {*}      [customData]
         * @param {number} delay
         */
        triggerEvent : function (element, eventName, customData = null, delay = 0) {
            if (delay === 0) {
                triggerEvent(element, eventName, customData);
            } else {
                setTimeout(function() { triggerEvent(element, eventName, customData) }, delay);
            }
        },

        /**
         * Returns the event element path.
         *
         * @param {Event} event
         * @return {Array}
         */
        getEventPath: function (event) {
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
        },

        /**
         * Tries to figure out the operating system
         *
         * @returns {string}
         */
        getDeviceOs: function () {
            let operatingSystem = 'Unknown';
            const patterns = ['Win', 'Mac', 'X11', 'Linux', 'iPhone', 'iPad', 'Android'];
            const supportedOperatingSystems = ['Windows', 'MacOS', 'Unix', 'Linux', 'iOS', 'iOS', 'Android'];

            for (let i in patterns) {
                if (navigator.platform.indexOf(patterns[i]) !== -1) {
                    operatingSystem = supportedOperatingSystems[i];
                }
            }

            return operatingSystem;
        },

        /**
         * Reads the pure stylesheets and collects all the Chart styles before rendering
         *
         * @param {String} className
         * @return {object}
         */
        readStylesheetsByClassName: function(className) {
            let styles = document.styleSheets || new StyleSheetList();
            let localStyles = {};
            let classes;
            let currentStyle = null;

            for (let i = 0, styleNum = styles.length; i < styleNum; i++) {
                // Can't access external stylesheets
                if (!styles[i].href || styles[i].href.includes(location.hostname) === false) {
                    continue
                }

                classes = styles[i].cssRules || new CSSRuleList();

                for (let j = 0, ruleNum = classes.length; j < ruleNum; j ++) {
                    currentStyle = classes[j];

                    if (currentStyle instanceof CSSImportRule || currentStyle instanceof CSSMediaRule) {
                        continue;
                    }

                    if (classes[j].selectorText && classes[j].selectorText.includes('.'+className)) {
// console.log(classes[j])
                        let customDefinitions = [];
                        localStyles[classes[j].selectorText] = {};

                        for (let key in classes[j].style) {
                            if (classes[j].style.hasOwnProperty(key) && !isNaN(key)) {
                                customDefinitions.push(classes[j].style[key].replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }));
                            }
                        }

                        for (let l = 0, definitionLength = customDefinitions.length; l < definitionLength; l++) {
                            localStyles[classes[j].selectorText][customDefinitions[l]] = classes[j].style[customDefinitions[l]];
                        }
                    }
                }
            }
            return localStyles;
        }
    };
};

window['Utility'] = Utility;