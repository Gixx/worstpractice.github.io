/**
 * Lazy Load Image component
 *
 * @type {{init: LazyLoadImage.init, getLazyLoadImages: (function(): NodeList)}}
 */
const LazyLoadImage = function (options) {
    "use strict";

    /** @type {boolean} */
    let initialized = false;
    /** @type {NodeList} */
    let lazyLoadImages;
    /** @type {number} */
    let idCounter = 1;
    /** @type {string} */
    let consoleColorId = '#bffff5';
    /** @type IntersectionObserver */
    let imageObserver;

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
    let LazyLoadImageElement = function (HTMLElement) {
        options.verbose && console.info(
            '%c[Lazy Load Image]%c ✚%c an image element initialized %o',
            'background:'+consoleColorId+';font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:black;',
            '#'+HTMLElement.getAttribute('id')
        );


        return {
            constructor: LazyLoadImageElement,

            loadImage: function () {
                if (!HTMLElement.hasAttribute('data-src')) {
                    return;
                }
                let imageSource = HTMLElement.dataset.src;
                let preload  = new Image();

                preload.addEventListener('error', function (event) {
                    event.preventDefault();
                    options.verbose && console.info(
                        '%c[Lazy Load Image]%c ✖%c an image resource is not found %c'+imageSource,
                        'background:'+consoleColorId+';font-weight:bold;',
                        'color:red',
                        'color:#599bd6',
                        'color:black;font-style:italic'
                    );
                });

                preload.addEventListener('load', function () {
                    HTMLElement.src = imageSource;
                    HTMLElement.removeAttribute('data-src');

                    options.verbose && console.info(
                        '%c[Lazy Load Image]%c ⚡%c an image element loaded %o',
                        'background:'+consoleColorId+';font-weight:bold;',
                        'color:orange;font-weight:bold',
                        'color:#599bd6',
                        '#'+HTMLElement.getAttribute('id')
                    );
                });

                preload.src = imageSource;
            }
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
        init : function () {
            if (initialized) {
                return;
            }

            options.verbose && console.info(
                '%c[Lazy Load Image]%c ...looking for image elements.',
                'background:'+consoleColorId+';font-weight:bold;',
                'color:#cecece'
            );

            imageObserver = new IntersectionObserver((entries, imgObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        /** @type LazyLoadImageElement lazyLoadImageElement */
                        let lazyLoadImageElement = entry.target.component;
                        lazyLoadImageElement.loadImage();
                    }
                })
            });

            lazyLoadImages = document.querySelectorAll('img[data-src]');

            lazyLoadImages.forEach(function (element) {
                if (!element.hasAttribute('id')) {
                    element.setAttribute('id', 'lazyImage' + (idCounter++));
                }

                element.component = new LazyLoadImageElement(element);
                imageObserver.observe(element);
            });

            window.Util.triggerEvent(document, 'Component.LazyLoadImage.Ready');
            initialized = true;
        },

        getLazyLoadImages: function () {
            return lazyLoadImages;
        }
    };
}({verbose: true});

window['LazyLoadImage'] = LazyLoadImage;
