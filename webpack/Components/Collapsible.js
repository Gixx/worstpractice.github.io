/**
 * Collapsible component.
 *
 * @returns {*}
 */
const Collapsible = function ()
{
    /** @instance Utility */
    let utility = globalThis.Components.get('utility')
    /** @instance Logger */
    let logger = new Logger('Collapsible', 'PaleGoldenRod');
    /** @type {NodeList} */
    let collapsibleButtons;
    /** @type {number} */
    let idCounter = 1;

    let collapsibleElements = [];

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /**
     * Initializes the component and collects the elements.
     */
    const initialize = function ()
    {
        logger.seekComponentElements();

        collapsibleButtons = document.querySelectorAll('.Collapsible button');

        if (collapsibleButtons.length === 0) {
            logger.componentElementsNotFound();
            return;
        }

        collapsibleButtons.forEach(function (HTMLElement) {
            if (!HTMLElement.hasAttribute('id')) {
                HTMLElement.setAttribute('id', 'Collapsible-' + (idCounter++));
            }

            collapsibleElements.push(new CollapsibleElement(HTMLElement));
        });

        utility.triggerEvent(document, 'Component.Collapsible.Ready', null, 1);
    };

    logger.componentLoaded();

    initialize();

    return {

        /**
         * Return the collection of collapsible elements
         *
         * @returns {*[]}
         */
        getElements: function() {
            return collapsibleElements;
        },

        /**
         * Toggle a collapsible element.
         *
         * @param {String} elementId
         */
        toggleCollapsibleById: function(elementId) {
            collapsibleElements.forEach(function (element) {
                if (element.getId() === elementId) {
                    element.toggle();
                }
            });
        }
    };
};

window['Collapsible'] = Collapsible;