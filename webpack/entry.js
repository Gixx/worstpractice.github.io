require('./components/Util');
require('./components/LazyLoadImage');
require('./components/FeatureToggle');
require('./components/GdprDialog');

const PRIVACY_ACCEPT_COOKIE_NAME = 'privacy_Accept';
const PRIVACY_COMMENTO_COOKIE_NAME = 'privacy_CommentoEnabled';

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

const embedCommentoPlugin = function() {
    let d = document, s = d.createElement('script');
    let commento = d.getElementById('commento');

    if (commento) {
        commento.innerHTML = '';
        s.src = 'https://cdn.commento.io/js/commento.js';
        s.setAttribute('defer','defer');
        s.setAttribute('data-auto-init', 'true');
        s.setAttribute('data-no-fonts', 'true');
        (d.head || d.body).appendChild(s);
    }
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
    let isPrivacyPolicyAccepted = function () {
        return Util.getCookie(PRIVACY_ACCEPT_COOKIE_NAME) === 'On';
    };

    let isCommentoEnabled = function () {
        return Util.getCookie(PRIVACY_COMMENTO_COOKIE_NAME) === 'On';
    };

    const featureToggle = {
        commento: {
            state: isCommentoEnabled(),
            label: "Do you allow the Commento to load?",
            cookie: PRIVACY_COMMENTO_COOKIE_NAME
        },
    };

    window.LazyLoadImage.init();
    window.FeatureToggle.init(featureToggle);
    window.GdprDialog.init();

    embedWorstPracticeSample();

    if (isCommentoEnabled()) {
        embedCommentoPlugin();
    }
});
