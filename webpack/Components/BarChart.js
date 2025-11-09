/**
 * BarChart component.
 *
 * @returns {*}
 */
const BarChart = function ()
{
    /** @instance Utility */
    let utility = globalThis.Components.get('utility');
    /** @instance Logger */
    let logger = new Logger('Bar Chart', 'MediumPurple');
    /** @type {NodeList} */
    let chartWrappers;
    /** @type {number} */
    let idCounter = 1;

    const barChartElements = [];

    /** @type {object} */
    const chartStyles = utility.readStylesheetsByClassName('BarChart');

    /**
     * Initializes the component and collects the elements.
     */
    const initialize = function ()
    {
        logger.seekComponentElements();

        chartWrappers = document.querySelectorAll('.BarChart .grid');

        if (chartWrappers.length ===0) {
            logger.componentElementsNotFound();
            return;
        }

        chartWrappers.forEach(function (HTMLElement) {
            if (!HTMLElement.hasAttribute('id')) {
                HTMLElement.setAttribute('id', 'BarChart-' + (idCounter++));
            }

            barChartElements.push(new BarChartElement(HTMLElement, chartStyles));
        });

        utility.triggerEvent(document, 'Component.BarChart.Ready', null,  1);
    };

    logger.componentLoaded();

    initialize();

    return {
        /**
         * Returns the collection of chart-elements
         *
         * @returns {*[]}
         */
        getElements: function() {
            return barChartElements;
        }
    };
};

window['BarChart'] = BarChart;