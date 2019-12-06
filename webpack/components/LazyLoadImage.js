const LazyLoadImage = function(options)
{
    "use strict";

    /** @type {boolean} */
    let initialized = false;
    /** @type {NodeList} */
    let lazyLoadImages;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    let consoleColorId = '#d0ffd0';

    if (typeof options.verbose === 'undefined') {
        options.verbose = true;
    }

    if (typeof window.Util === 'undefined') {
        throw new ReferenceError('This component requires the Util component to be loaded.');
    }

    /**
     * Adds lazy-load behaviour to an image element.
     *
     * @param HTMLElement
     * @returns {any}
     * @constructor
     */
    let LazyLoadImageElement = function(HTMLElement)
    {
        /** @type {boolean} */
        let loading = false;
        /** @type {boolean} */
        let loaded = false;

        /**
         * Checks if the image is in the viewPort
         *
         * @returns {boolean}
         */
        function isElementInViewport()
        {
            let rect = HTMLElement.getBoundingClientRect();

            return (
                rect.top >= 0
                && rect.left   >= 0
                && rect.top <= (window.innerHeight || document.documentElement.clientHeight)
            );
        }

        /**
         * Load image.
         */
        function loadImage()
        {
            if (loaded || loading) {
                return;
            }

            if (isElementInViewport()) {
                loading = true;
                let src = HTMLElement.getAttribute('data-src');
                let preload = new Image;

                preload.onerror = function() {
                    options.verbose && console.info(
                        '%c[Lazy Load Image]%c ✖%c the image ' + src + ' cannot be loaded.',
                        'background:'+consoleColorId+';font-weight:bold;',
                        'color:red',
                        'color:black'
                    );
                    return true;
                };

                preload.onload = function() {
                    HTMLElement.src = src;
                    HTMLElement.removeAttribute('data-src');
                    options.verbose && console.info(
                        '%c[Lazy Load Image]%c ⚡%c an image element loaded %o',
                        'background:'+consoleColorId+';font-weight:bold;',
                        'color:orange;font-weight:bold',
                        'color:#599bd6',
                        '#'+HTMLElement.getAttribute('id')
                    );
                };

                try {
                    preload.src = src;
                    loaded = true;
                } catch (exp) {
                    loading = false;
                }
            }
        }

        window.Util.addEventListeners([window], 'scroll', loadImage, this);

        options.verbose && console.info(
            '%c[Lazy Load Image]%c ✚%c an image element initialized %o',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );

        loadImage();

        return {
            constructor: LazyLoadImageElement
        }
    };

    options.verbose && console.info(
        '%c[Lazy Load Image]%c ✔%c The Lazy Load Image component loaded.',
        'background:'+consoleColorId+';font-weight:bold;',
        'color:green; font-weight:bold;',
        'color:black; font-weight:bold;'
    );

    return {
        /**
         * Initializes the loader and collects the elements.
         */
        init : function()
        {
            if (initialized) {
                return;
            }

            options.verbose && console.group(
                '%c[Lazy Load Image]%c ...looking for image elements.',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:#cecece'
            );
            lazyLoadImages = document.querySelectorAll('img[data-src]');

            for (let i = 0, len = lazyLoadImages.length; i < len; i++) {
                if (!lazyLoadImages[i].hasAttribute('id')) {
                    lazyLoadImages[i].setAttribute('id', 'lazyImage' + (idCounter++));
                }

                lazyLoadImages[i].component = new LazyLoadImageElement(lazyLoadImages[i]);
            }

            options.verbose && console.groupEnd();

            window.Util.triggerEvent(document, 'lazyLoadImageComponentLoaded');
            initialized = true;
        }
    };
}({verbose: true});

window['LazyLoadImage'] = LazyLoadImage;
