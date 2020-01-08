/**
 * Feature Toggle component
 *
 * @type {{init: FeatureToggle.init}}
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
        checkbox.setAttribute('id', 'feature-toggle-' + featureName);
        checkbox.addEventListener('change', function (event) {
            let element = event.target;
            switchState(element.checked);
        });

        let label = document.createElement('label');
        label.setAttribute('for', 'feature-toggle-' + featureName);
        let labelText = document.createTextNode(toggleOptions.label);
        let labelSwitch = document.createElement('span');
        label.appendChild(labelText);
        label.appendChild(labelSwitch);

        HTMLElement.appendChild(checkbox);
        HTMLElement.appendChild(label);

        /**
         *
         * @param {Boolean} state
         */
        let switchState = function (state) {
            document.getElementById('feature-toggle-' + featureName).checked = state;
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
            constructor: FeatureToggleSwitchElement,

            /**
             * Toggles the switch on.
             */
            on: function() {
                switchState(true);
            },

            /**
             * Toggles the switch off.
             */
            off: function () {
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
        }
    };
}({verbose: true});

window['FeatureToggle'] = FeatureToggle;
