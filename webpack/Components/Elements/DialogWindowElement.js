/**
 * A Dialog element.
 *
 * @param {HTMLDivElement|Node} HTMLElement
 * @returns {*}
 */
const DialogWindowElement = function (HTMLElement)
{
    /** @instance Utility */
    let utility = globalThis.Components.get('utility')
    /** @instance Logger */
    let logger = new Logger('Dialog Window Element', 'Teal');

    const okButton = HTMLElement.querySelector('.d-buttons__ok');
    const saveButton = HTMLElement.querySelector('.d-buttons__save');
    const applyButton = HTMLElement.querySelector('.d-buttons__apply');
    const deleteButton = HTMLElement.querySelector('.d-buttons__delete');
    const cancelButton = HTMLElement.querySelector('.d-buttons__cancel');
    const closeButton = HTMLElement.querySelector('.d-buttons__close');

    const introTabSwitchButton = HTMLElement.querySelector('.d-buttons__showIntro');
    const settingsTabSwitchButton = HTMLElement.querySelector('.d-buttons__showSettings');

    const contentIntro = HTMLElement.querySelector('.d-tab.-intro');
    const contentSettings = HTMLElement.querySelector('.d-tab.-settings');

    const openDialog = function() {
        HTMLElement.style.display = 'block';
        logger.actionTriggered('"'+HTMLElement.id+'" Dialog window is opened', HTMLElement.id);
    };

    const dialogName = HTMLElement.dataset.name;

    /**
     * Closes the modal window
     */
    const closeDialog = function () {
        HTMLElement.style.display = 'none';
        logger.actionTriggered('"'+HTMLElement.id+'" Dialog window is closed', HTMLElement.id);
    };

    /**
     * Button click events
     */
    okButton && okButton.addEventListener('click', function () {
        utility.triggerEvent(HTMLElement, 'Component.Dialog.Action.OK');
        closeDialog();
    });

    saveButton && saveButton.addEventListener('click', function () {
        utility.triggerEvent(HTMLElement, 'Component.Dialog.Action.Save');
        closeDialog();
    });

    applyButton && applyButton.addEventListener('click', function () {
        utility.triggerEvent(HTMLElement, 'Component.Dialog.Action.Apply');
        closeDialog();
    });

    deleteButton && deleteButton.addEventListener('click', function () {
        utility.triggerEvent(HTMLElement, 'Component.Dialog.Action.Delete');
        closeDialog();
    });

    cancelButton && cancelButton.addEventListener('click', function () {
        utility.triggerEvent(HTMLElement, 'Component.Dialog.Action.Cancel');
        closeDialog();
    });

    closeButton && closeButton.addEventListener('click', function () {
        utility.triggerEvent(HTMLElement, 'Component.Dialog.Action.Close');
        closeDialog();
    });

    settingsTabSwitchButton && settingsTabSwitchButton.addEventListener('click', function () {
        contentIntro.classList.remove('-active');
        contentSettings.classList.add('-active');
    });

    introTabSwitchButton && introTabSwitchButton.addEventListener('click', function () {
        contentIntro.classList.add('-active');
        contentSettings.classList.remove('-active');
    });

    logger.componentElementInitSuccess(HTMLElement.id);

    return {
        /**
         * Returns the element ID.
         *
         * @returns {string}
         */
        getId: function () {
            return HTMLElement.id;
        },

        /**
         * Returns the element name.
         *
         * @returns {string}
         */
        getName: function() {
            return dialogName;
        },

        /**
         * Returns the HTML element
         *
         * @returns {HTMLDivElement|Node}
         */
        getHTMLElement: function () {
            return HTMLElement;
        },

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

window['DialogWindowElement'] = DialogWindowElement;