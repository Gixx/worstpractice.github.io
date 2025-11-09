/**
 * A Bar Chart Element.
 *
 * @param {HTMLDivElement|Node} HTMLElement
 * @param {object} chartStyles
 * @return {*}
 */
const BarChartElement = function (HTMLElement, chartStyles)
{
    /** @instance Logger */
    let logger = new Logger('Bar Chart Element', 'MediumOrchid');
    /** @type {number} */
    const currentYear = (new Date()).getFullYear();
    /** @type {number} */
    const currentQuarter = Math.ceil(((new Date()).getMonth() + 1) / 4);

    const chartDataset = HTMLElement.querySelector('dl.chart-dataset');
    const rangeFrom = parseInt(chartDataset.dataset.rangefrom);
    const rangeTo = (new Date()).getFullYear()+1;
    const labels = chartDataset.querySelectorAll('dt');
    const bars = chartDataset.querySelectorAll('dd');

    let grid = '';
    let label = '';
    let style = '';

    for (let i = rangeTo; i >= rangeFrom; i--) {
        for (let j = 4; j > 0; j--) {
            label = j === 1 ? '<span>'+i+'</span>' : '';
            style = 'gridRow';

            if (j === 1) {
                style += ' year';
            }

            if (j === currentQuarter && i === currentYear) {
                style += ' thisQuarter';
            }

            grid += '<div class="'+style+'">'+label+'</div>';
        }
    }

    grid += '<div class="labels">';
    for (let index in labels) {
        if (labels.hasOwnProperty(index)) {
            let label = labels[index].innerText;
            grid += '<div>'+label+'</div>';
        }
    }
    grid += '</div>';

    for (let index in bars) {
        if (bars.hasOwnProperty(index)) {
            let bar = bars[index];
            let fromData = bar.dataset.from;
            let toData = bar.dataset.to;
            let skill = bar.dataset.skill;
            let counter = parseInt(index) + 1;

            let offsetBottom = getOffset(fromData, rangeFrom);
            let offsetTop = getOffset(toData, rangeFrom);

            grid += '<div class="skill '+skill+' col'+counter+'" style="bottom: '+offsetBottom+'px; height: '+(offsetTop-offsetBottom)+'px"></div>';
        }
    }

    /**
     * Counts the offset from the date info
     *
     * @param {string} dateInfo
     * @param {number} rangeFrom
     * @returns {number}
     */
    function getOffset(dateInfo, rangeFrom)
    {
        let startOffset = chartStyles['.BarChart .grid'].paddingBottom;

        if (startOffset.indexOf('px') !== -1)
            startOffset = parseInt(startOffset.replace(/px/, ''));
        else {
            startOffset = parseInt((parseFloat(startOffset.replace(/rem/, '')) * 10.0) + '');
        }

        let rowHeight = chartStyles['.BarChart .gridRow'].height;

        if (rowHeight.indexOf('px') !== -1)
            rowHeight = parseInt(rowHeight.replace(/px/, ''));
        else {
            rowHeight = parseInt((parseFloat(rowHeight.replace(/rem/, '')) * 10.0) + '');
        }

        if (dateInfo === 'today') {
            dateInfo = currentYear+'/Q'+currentQuarter;
        }

        const yearQuarter = dateInfo.split('/Q');
        const year = parseInt(yearQuarter[0]);
        const quarter = parseInt(yearQuarter[1]);
        // * 1 full year = 4 quarters, so the number of full years ((year - rangeFrom) * 4)
        // * new year = the 4th quarter finished, so it's already counted in full years, so a not full year (quarter - 1)
        // * The sum of full years and remaining quarters give the height of the bar: multiply with the height
        //   of a grid row and adds the bottom position
        return ((((year - rangeFrom) * 4) + (quarter - 1)) * rowHeight) + startOffset;
    }

    HTMLElement.innerHTML = grid;

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
            return HTMLElement.id;
        },

        /**
         * Returns the HTML element
         *
         * @returns {HTMLDivElement|Node}
         */
        getHTMLElement: function () {
            return HTMLElement;
        },
    }
};

window['BarChartElement'] = BarChartElement;
