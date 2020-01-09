/**
 * Feature Toggle component
 *
 * @type {{init: FeatureToggle.init, toggleAll: FeatureToggle.toggleAll, toggle: FeatureToggle.toggle, getComponentsByName: (function(String): [])}}
 */
const FeatureToggle = function (options) {
    "use strict";

    /** @type {boolean} */
    let initialized = false;
    /** @type {NodeList} */
    let featureToggleSwitches;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    let consoleColorId = '#FF9B49';

    if (typeof options.verbose === 'undefined') {
        options.verbose = true;
    }

    if (typeof window.Util === 'undefined') {
        throw new ReferenceError('This component requires the Util component to be loaded.');
    }

    /**
     * A Feature Toggle Switch element
     *
     * @param {Element|Node} HTMLElement
     * @param {String} featureName
     * @param {{state: boolean, label: string, cookie: string}} toggleOptions
     * @returns {any}
     * @constructor
     */
    let FeatureToggleSwitchElement = function (HTMLElement, featureName, toggleOptions) {
        // Wipe out any dirt
        HTMLElement.innerHTML = '';

        let state = Util.getCookie(toggleOptions.cookie) === 'On'
            ? true
            : toggleOptions.state;

        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', HTMLElement.id + '-' + featureName);
        checkbox.addEventListener('change', function () {
            FeatureToggle.toggle(featureName)
        });

        let label = document.createElement('label');
        label.setAttribute('for', HTMLElement.id + '-' + featureName);
        let labelText = document.createTextNode(toggleOptions.label);
        let labelSwitch = document.createElement('span');
        label.appendChild(labelText);
        label.appendChild(labelSwitch);

        HTMLElement.appendChild(checkbox);
        HTMLElement.appendChild(label);

        /**
         *
         * @param {Boolean} setActive
         */
        let switchState = function (setActive) {
            state = setActive;
            document.getElementById(HTMLElement.id + '-' + featureName).checked = state;
            Util.setCookie(toggleOptions.cookie, state ? 'On' : 'Off', 365);
        };

        switchState(state);

        options.verbose && console.info(
            '%c[Feature Toggle Switch]%c ✚%c a switch element initialized %o',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );

        return {
            constructor : FeatureToggleSwitchElement,

            /**
             * Returns the feature name.
             *
             * @returns {String}
             */
            getFeatureName : function() {
                return featureName;
            },

            /**
             * Returns the current state.
             *
             * @returns {String}
             */
            getState : function () {
                return state ? 'on' : 'off';
            },

            /**
             * Toggles the switch on.
             */
            on : function() {
                switchState(true);
            },

            /**
             * Toggles the switch off.
             */
             off : function () {
                switchState(false);
            }
        }
    };

    options.verbose && console.info(
        '%c[Feature Toggle Switch]%c ✔%c The Feature Toggle Switch element component loaded.',
        'background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        /**
         * Initialize the component handler.
         */
        init : function () {
            if (initialized) {
                return;
            }

            let featureToggleTargets = typeof arguments[0] !== 'undefined'
                ? arguments[0]
                : {};

            options.verbose && console.info(
                '%c[Feature Toggle Switch]%c ...looking for Feature Toggle Switch elements.',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:#cecece'
            );

            featureToggleSwitches = document.querySelectorAll('div[data-feature]');

            featureToggleSwitches.forEach(function (element) {
                /** @type {Element} element */
                if (!element.hasAttribute('id')) {
                    element.setAttribute('id', 'featureToggle' + (idCounter++));
                }

                let featureName = element.dataset.feature;
                let toggleOptions = (typeof featureToggleTargets[featureName] !== 'undefined')
                    ? featureToggleTargets[featureName]
                    : {state: false, label: 'Toggle feature "'+featureName+'" On or Off', cookie: 'feature_'+featureName};

                element.component = new FeatureToggleSwitchElement(element, featureName, toggleOptions);
            });

            window.Util.triggerEvent(document, 'Component.FeatureToggle.Ready');
            initialized = true;
        },

        /**
         * Get all FeatureToggle elements by name.
         *
         * @param {String} featureToggleName
         * @returns {[]}
         */
        getComponentsByName : function(featureToggleName) {
            if (!initialized) {
                this.init();
            }

            let components = [];

            featureToggleSwitches.forEach(function (element) {
                if (typeof element.component !== 'undefined') {
                    if (element.component.getFeatureName() === featureToggleName) {
                        components.push(element.component);
                    }
                }
            });

            return components;
        },

        /**
         * Toggle FeatureToggle element(s) by the given name.
         *
         * @param {String} featureToggleName The non-unique name of the FeatureToggle element.
         * @return {Array}
         */
        toggle : function(featureToggleName) {
            if (!initialized) {
                this.init();
            }

            featureToggleSwitches.forEach(function (element) {
                if (typeof element.component !== 'undefined') {
                    if (element.component.getFeatureName() === featureToggleName) {
                        if (element.component.getState() === 'on') {
                            element.component.off();
                        } else {
                            element.component.on();
                        }
                    }
                }
            });
        },

        /**
         * Toggle on/off all FeatureToggle elements.
         *
         * @param {String} newState The new status: 'on' or 'off'.
         */
        toggleAll : function (newState) {
            if (!initialized) {
                this.init();
            }

            if (['on', 'off'].indexOf(newState) === -1) {
                newState = 'on';
            }

            featureToggleSwitches.forEach(function (element) {
                if (typeof element.component !== 'undefined') {
                    if (newState === 'on') {
                        element.component.on();
                    } else {
                        element.component.off();
                    }
                }
            });
        }
    };
}({verbose: true});

window['FeatureToggle'] = FeatureToggle;
