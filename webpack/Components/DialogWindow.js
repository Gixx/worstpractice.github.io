/**
 * DialogWindow component.
 *
 * @returns {*}
 */
const DialogWindow = function ()
{
    /** @instance Utility */
    let utility = globalThis.Components.get('utility')
    /** @instance Logger */
    let logger = new Logger('Dialog Window', 'Turquoise');

    let dialogWindowElements = [];
    /** @type {number} */
    let idCounter = 1;

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /**
     * Initializes the component and collects the elements.
     */
    const initialize = function ()
    {
        logger.seekComponentElements();

        const dialogHTMLElements = document.querySelectorAll('.DialogWindow');

        if(dialogHTMLElements.length === 0) {
            logger.componentElementsNotFound();
            return;
        }

        dialogHTMLElements.forEach(function (HTMLElement) {
            if (!HTMLElement.hasAttribute('id')) {
                HTMLElement.setAttribute('id', 'DialogWindow-' + (idCounter++));
            }

            dialogWindowElements.push(new DialogWindowElement(HTMLElement));
        });

        utility.triggerEvent(document, 'Component.DialogWindow.Ready', null, 1);
    };

    logger.componentLoaded();
    initialize();

    return {
        /**
         * Returns the collection of dialog elements
         *
         * @returns {*[]}
         */
        getElements: function () {
            return dialogWindowElements;
        },

        /**
         *
         * @param {String} dialogName
         */
        getDialogWindowElementByName: function(dialogName) {
            dialogWindowElements.forEach(function (element) {
                if (element.getName() === dialogName) {
                    return element;
                }
            });

            return null;
        }
    };
};

window['DialogWindow'] = DialogWindow;

