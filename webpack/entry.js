window['PRIVACY_ACCEPT_COOKIE_NAME'] = 'privacy_Accept_20200109';
window['PRIVACY_COMMENTO_COOKIE_NAME'] = 'privacy_CommentoEnabled';

require('./components/Util');
require('./components/Cookie');
require('./components/LazyLoadImage');
require('./components/FeatureToggle');
require('./components/GdprDialog');

/**
 * Embed a "Worst practice" code sample.
 */
const embedWorstPracticeSample = function () {
    const badCodesCounter = 4;
    let badCodes = [];

    for (let i = 1; i <= badCodesCounter; i++) {
        let fileCounter = '' + i;
        badCodes.push(fileCounter.padStart(4, '0') + '.html');
    }

    let date = new Date();
    let day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    let month = (date.getMonth() + 1);
    if (month < 10) {
        month = '0' + month;
    }
    let year = date.getFullYear();
    let today = parseInt(year + '' + month + '' + day);
    let codeOfTheDay = today % badCodes.length;

    Util.fetch({
        url: '/code-of-the-day/' + badCodes[codeOfTheDay],
        method: 'GET',
        enctype: 'text/html',
        successCallback: function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }

            // Examine the text in the response
            response.text().then(function (data) {
                document.querySelector('.codeOfTheDay__content').innerHTML = data;
                document.querySelector('input.codeOfTheDay__toggle').addEventListener('click', function (event) {
                    /** @type HTMLInputElement */
                    let element = event.target;
                    if (element.checked) {
                        scrollTo({ top: 0, behavior: 'smooth' });
                        // scrollTo(0, 0);
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
    let scriptElement = document.createElement('script');
    let commento = document.getElementById('commento');

    if (commento) {
        commento.innerHTML = '';
        scriptElement.src = 'https://cdn.commento.io/js/commento.js';
        scriptElement.setAttribute('defer','defer');
        scriptElement.setAttribute('data-auto-init', 'true');
        scriptElement.setAttribute('data-no-fonts', 'true');
        (document.head || document.body).appendChild(scriptElement);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    Util.init();

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
    Cookie.init();

    Cookie.renew({cookieName: PRIVACY_ACCEPT_COOKIE_NAME});
    Cookie.renew({cookieName: PRIVACY_COMMENTO_COOKIE_NAME});

    LazyLoadImage.init();
    embedWorstPracticeSample();


});

document.addEventListener('Component.Cookie.Ready', function () {
    const isCommentoEnabled = Cookie.get({cookieName: PRIVACY_COMMENTO_COOKIE_NAME}) === 'On';

    const featureToggle = {
        commento: {
            state: isCommentoEnabled,
            label: "Do you allow the Commento to load?",
            cookie: PRIVACY_COMMENTO_COOKIE_NAME
        },
    };

    FeatureToggle.init(featureToggle);

    if (isCommentoEnabled) {
        embedCommentoPlugin();
    }
});

document.addEventListener('Component.FeatureToggle.Ready', function () {
    GdprDialog.init();
});
