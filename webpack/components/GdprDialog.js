/**
 * GDPR Dialog component.
 * @param {object} utility
 * @param {object} storage
 * @param {string} storageKey
 * @param {object} featureToggle
 * @param {boolean} verbose
 * @returns {*}
 * @constructor
 */
const GdprDialog = function ({utility, storage, storageKey,featureToggle,  verbose = false})
{
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    let consoleColorId = '#FFA3EA';

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    if (!storage instanceof CookieStorage || !storage instanceof DataStorage) {
        throw new ReferenceError('This component requires either the CookieStorage or the LocalStorage component to be loaded.');
    }

    if (!featureToggle instanceof FeatureToggleSwitch) {
        throw new ReferenceError('This component requires the FeatureToggleSwitch component to be loaded.');
    }

    /**
     * A GDPR Dialog element.
     *
     * @param {HTMLDivElement} HTMLElement
     * @returns {*}
     * @constructor
     */
    let GdprDialogElement = function ({HTMLElement})
    {
        const acceptAllButton = HTMLElement.querySelector('.g-buttons__acceptAll');
        const closeButton = HTMLElement.querySelector('.g-buttons__close');
        const settingsTabSwitchButton = HTMLElement.querySelector('.g-buttons__showSettings');
        const introTabSwitchButton = HTMLElement.querySelector('.g-buttons__showIntro');

        const contentIntro = HTMLElement.querySelector('.g-tab.-intro');
        const contentSettings = HTMLElement.querySelector('.g-tab.-settings');

        const privacyLinks = HTMLElement.querySelectorAll('a.privacy');

        let openDialog = function() {
            HTMLElement.style.display = 'block';
            verbose && console.info(
                '%c[GDPR Dialog]%c ⚡%c Dialog window opened : %o',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                HTMLElement.id
            );
        };

        /**
         * Closes the modal window
         */
        let closeDialog = function () {
            HTMLElement.style.display = 'none';
            verbose && console.info(
                '%c[GDPR Dialog]%c ⚡%c Dialog window closed : %o',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                HTMLElement.id
            );
        };

        let setPrivacyCookie = function() {
            storage.set({key: storageKey, value: 'On'});
        };

        acceptAllButton.addEventListener('click', function () {
            featureToggle.toggleAll({newState:'on'});
            setPrivacyCookie();
            closeDialog();
        });

        settingsTabSwitchButton.addEventListener('click', function () {
            contentIntro.classList.remove('-active');
            contentSettings.classList.add('-active');
        });

        introTabSwitchButton.addEventListener('click', function () {
            contentIntro.classList.add('-active');
            contentSettings.classList.remove('-active');
        });

        closeButton.addEventListener('click', function () {
            setPrivacyCookie();
            closeDialog();
        });

        privacyLinks.forEach(function (privacyLink) {
            privacyLink.addEventListener('click', function () {
                setPrivacyCookie();
                closeDialog();
            });
        });

        verbose && console.info(
            '%c[GDPR Dialog]%c ✚%c the GDPR Dialog element initialized %o',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );

        if (storage.get({key: storageKey}) !== 'On') {
            openDialog();
        }

        return {
            constructor: GdprDialogElement,

            /**
             * Opens the modal window.
             */
            open: function() {
                openDialog();
            },

            /**
             * Closes the modal window
             */
            close: function () {
                closeDialog();
            }
        }
    };

    /**
     * Initializes the component and collects the elements.
     */
    let initialize = function ()
    {
        verbose && console.info(
            '%c[GDPR Dialog]%c ...looking for the GDPR Dialog element.',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:#cecece'
        );

        /** @type {HTMLDivElement|Node} element */
        let dialogElement = document.querySelector('.dialog.g-gdpr');

        if (!dialogElement.hasAttribute('id')) {
            dialogElement.setAttribute('id', 'GdprDialog' + (idCounter++));
        }

        dialogElement.component = new GdprDialogElement({HTMLElement: dialogElement});

        utility.triggerEvent({element: document, eventName: 'Component.GdprDialog.Ready'});
    };

    verbose && console.info(
        '%c[GDPR Dialog]%c ✔%c The GDPR Dialog component loaded.',
        'background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    initialize();

    return {
        constructor: GdprDialog
    };
};

window['GdprDialog'] = GdprDialog;
