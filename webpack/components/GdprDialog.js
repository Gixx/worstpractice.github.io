/**
 * GDPR Dialog component
 *
 * @type {{init: GdprDialog.init}}
 */
const GdprDialog = function (options) {
    "use strict";

    /** @type {boolean} */
    let initialized = false;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    let consoleColorId = '#ffa3ea';

    if (typeof options.verbose === 'undefined') {
        options.verbose = true;
    }

    if (typeof window.Util === 'undefined') {
        throw new ReferenceError('This component requires the Util component to be loaded.');
    }

    if (typeof window.FeatureToggle === 'undefined') {
        throw new ReferenceError('This component requires the FeatureToggle component to be loaded.');
    }

    /**
     * @param {HTMLDialogElement} HTMLElement
     * @constructor
     */
    let GdprDialogElement = function (HTMLElement) {
        let openDialog = function() {
            HTMLElement.showModal();
            options.verbose && console.info(
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
            HTMLElement.close();
            options.verbose && console.info(
                '%c[GDPR Dialog]%c ⚡%c Dialog window closed : %o',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:#599bd6',
                HTMLElement.id
            );
        };

        HTMLElement.querySelector('.g-buttons__acceptAll').addEventListener('click', function () {
            FeatureToggle.toggleAll('on');
            Util.setCookie(window.PRIVACY_ACCEPT_COOKIE_NAME, 'On', 365);
            closeDialog();
        });

        HTMLElement.querySelector('.g-buttons__showSettings').addEventListener('click', function () {
            HTMLElement.querySelector('.g-tab.-intro').classList.remove('-active');
            HTMLElement.querySelector('.g-tab.-settings').classList.add('-active');
        });

        HTMLElement.querySelector('.g-buttons__showIntro').addEventListener('click', function () {
            HTMLElement.querySelector('.g-tab.-settings').classList.remove('-active');
            HTMLElement.querySelector('.g-tab.-intro').classList.add('-active');
        });

        HTMLElement.querySelector('.g-buttons__close').addEventListener('click', function () {
            Util.setCookie(window.PRIVACY_ACCEPT_COOKIE_NAME, 'On', 365);
            closeDialog();
        });

        HTMLElement.querySelectorAll('a.privacy').forEach(function (element) {
            element.addEventListener('click', function () {
                Util.setCookie(window.PRIVACY_ACCEPT_COOKIE_NAME, 'On', 365);
                closeDialog();
            });
        });

        options.verbose && console.info(
            '%c[GDPR Dialog]%c ✚%c the GDPR Dialog element initialized %o',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );

        if (Util.getCookie(window.PRIVACY_ACCEPT_COOKIE_NAME) !== 'On') {
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

    options.verbose && console.info(
        '%c[GDPR Dialog]%c ✔%c The GDPR Dialog component loaded.',
        'background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        init : function () {
            if (initialized) {
                return;
            }

            options.verbose && console.info(
                '%c[GDPR Dialog]%c ...looking for the GDPR Dialog element.',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:#cecece'
            );

            /** @type {HTMLDialogElement} element */
            let dialogElement = document.querySelector('dialog.g-gdpr');

            if (!dialogElement.hasAttribute('id')) {
                dialogElement.setAttribute('id', 'GdprDialog' + (idCounter++));
            }

            dialogElement.component = new GdprDialogElement(dialogElement);

            window.Util.triggerEvent(document, 'Component.GdprDialog.Ready');
            initialized = true;
        }
    };
}({verbose: true});

window['GdprDialog'] = GdprDialog;