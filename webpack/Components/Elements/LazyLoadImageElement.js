/**
 * Adds lazy-load behaviour to an image element.
 *
 * @param {HTMLImageElement|Node} HTMLElement
 * @returns {*}
 */
const LazyLoadImageElement = function (HTMLElement)
{
    /** @instance Logger */
    let logger = new Logger('Lazy Load Image Element', 'SkyBlue');

    logger.componentElementInitSuccess(HTMLElement.id)

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

        /**
         * Loads the actual image when it gets into view
         */
        loadImage: function () {
            if (!HTMLElement.hasAttribute('data-src')) {
                return;
            }
            const imageSource = HTMLElement.dataset.src;
            const preload  = new Image();

            preload.addEventListener('error', function (event) {
                event.preventDefault();
                logger.actionFailed('An image resource is not found', imageSource);
            });

            preload.addEventListener('load', function () {
                HTMLElement.src = imageSource;
                HTMLElement.removeAttribute('data-src');
                logger.actionSuccess('A Lazy Load Image element loaded', HTMLElement.getAttribute('id'));
            });

            preload.src = imageSource;
        }
    }
};

window['LazyLoadImageElement'] = LazyLoadImageElement;
