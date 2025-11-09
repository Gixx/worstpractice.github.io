/**
 * A Collapsible Element.
 *
 * @param {HTMLDivElement|Node} HTMLElement
 * @return {*}
 */
const CollapsibleElement = function (HTMLElement)
{
    /** @instance Logger */
    let logger = new Logger('CollapsibleElement', 'LightYellow');

    if (!HTMLElement.nextElementSibling?.classList.contains('Collapsible__content')) {
        return false;
    }

    HTMLElement.addEventListener('click', function(event) {
        toggleCollapsible(event.target);
    });

    const toggleCollapsible = function (HTMLElement) {
        HTMLElement.classList.toggle('active');

        let isActive  = HTMLElement.classList.contains('active');

        logger.actionTriggered('Element ' + (isActive ? 'opened' : 'closed'), HTMLElement.id)

        const content = HTMLElement.nextElementSibling;

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }

    logger.componentElementInitSuccess(HTMLElement.getAttribute('id'));

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
         * Toggle this Collapsible Element.
         */
        toggle: function () {
            toggleCollapsible(HTMLElement);
        }
    }
}

window['CollapsibleElement'] = CollapsibleElement