/**
 * SmoothScroll component.
 *
 * @returns {*}
 */
const SmoothScroll = function ()
{
    /** @instance Utility */
    let utility = globalThis.Components.get('utility')
    /** @instance Logger */
    let logger = new Logger('Smooth Scroll', 'SteelBlue');

    if (!utility instanceof Utility) {
        throw new ReferenceError('This component requires the Utility component to be loaded.');
    }

    /**
     * Return the actual scroll position in pixels.
     *
     * @return {number}
     */
    const getScrollPosition = function () {
        return window.scrollY;
    };

    /**
     * Return the client height in pixels.
     *
     * @return {number}
     */
    const getClientHeight = function () {
        return document.documentElement.clientHeight;
    }

    /**
     * Return the document height in pixels.
     *
     * @return {number}
     */
    const getDocumentHeight = function () {
        return document.body.offsetHeight;
    }

    /**
     * Return the maximum scroll position available in pixels.
     * @return {number}
     */
    const getMaxScrollTop = function () {
        return getDocumentHeight() - getClientHeight();
    }

    /**
     * Return the actual scroll position of an element in the document.
     *
     * @param {String} elementId
     * @return {number}
     */
    const getElementPosition = function (elementId) {
        const element = document.getElementById(elementId);

        if (!element) {
            return 0;
        }

        const boundingBox = element.getBoundingClientRect();
        return boundingBox.top;
    }

    /**
     * Takes small steps until reach the target.
     *
     * @param {Number} from
     * @param {Number} to
     */
    const smoothScroll = function (from, to) {
        const stepBy = 0.2;
        const snapDistance = 1;
        const speed = 30;
        const diff = to - from;

        if (Math.abs(diff) <= snapDistance) {
            scrollTo(0.0, to);
            logger.actionSuccess('Scroll end', to+'px');
            return;
        }

        const nextPosition = (from * (1.0 - stepBy)) + (to * stepBy);
        scrollTo(0.0, Math.round(nextPosition));

        setTimeout(smoothScroll, speed, nextPosition, to);
    }

    /**
     * Initializes the component and collects the elements.
     */
    const initialize = function ()
    {
        utility.triggerEvent(document, 'Component.SmoothScroll.Ready', null, 1);
    };

    logger.componentLoaded();

    initialize();

    return {
        /**
         * Return the actual scroll position in pixels.
         *
         * @return {number}
         */
        getScrollPosition: function() {
            return getScrollPosition();
        },

        /**
         * Return the actual scroll position of an element in the document.
         *
         * @param {String} elementId
         * @return {number}
         */
        getElementPositionById: function(elementId) {
            return getElementPosition(elementId);
        },

        /**
         * Scroll to an element specified by its ID.
         *
         * @param {String} elementId The ID of the HTML element to scroll
         * @param {Number} gap       The gap to keep on top in pixels
         */
        scrollToElementById: function(elementId, gap) {
            const element = document.getElementById(elementId);

            if (!element) {
                return false;
            }

            const targetPosition = Math.min((getScrollPosition() + getElementPosition(elementId) - gap), getMaxScrollTop());

            logger.actionTriggered('Start scroll', getScrollPosition()+'px')
            smoothScroll(getScrollPosition(), targetPosition);
        }
    };
};

window['SmoothScroll'] = SmoothScroll;