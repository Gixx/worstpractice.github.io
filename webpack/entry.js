require('./components/Util');
require('./components/LazyLoadImage');
require('./components/FeatureToggle');

const PRIVACY_ACCEPT_COOKIE_NAME = 'privacy_Accept';
const PRIVACY_DISQUS_COOKIE_NAME = 'privacy_DisqusEnabled';

/**
 * Embed a "Worst practice" code sample.
 */
const embedWorstPracticeSample = function () {
    window.Util.fetch({
        url: '/code-of-the-day/0001.html',
        method: 'GET',
        enctype: 'text/html',
        success: function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }

            // Examine the text in the response
            response.text().then(function (data) {
                document.querySelector('.codeOfTheDay__content').innerHTML = data;
                document.querySelector('.codeOfTheDay__toggle').addEventListener('click', function (event) {
                    if (event.target.checked) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        // window.scrollTo(0, 0);
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflowY = 'auto';
                        document.body.style.overflowX = 'hidden';
                    }
                });
            });
        }
    });
};

document.addEventListener('DOMContentLoaded', function () {
    window.Util.init();

    document.querySelectorAll('a.google').forEach(function (element) {
        element.addEventListener('click', function (event) {
            if (!confirm('This link will take you to a Google Service website.\nDo you really want it?')) {
                event.preventDefault();
                return false;
            }
        })
    })
});

document.addEventListener('Component.Util.Ready', function () {
    window['isDisqusEnabled'] = function () {
        return Util.getCookie(PRIVACY_DISQUS_COOKIE_NAME) === 'On';
    };

    /**
     *
     * @type {{disqus: {state: boolean, label: string}}}
     */
    const featureToggle = {
        disqus: {
            state: isDisqusEnabled(),
            label: "Do you allow the Disqus to load?",
            cookie: PRIVACY_DISQUS_COOKIE_NAME
        }
    };

    window.LazyLoadImage.init();
    window.FeatureToggle.init(featureToggle);
    embedWorstPracticeSample();
});
