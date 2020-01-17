window['PRIVACY_ACCEPT_COOKIE_NAME'] = 'privacy_Accept_20200109';
window['PRIVACY_COMMENTO_COOKIE_NAME'] = 'privacy_CommentoEnabled';

require('./components/Util');
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

const isCommentoEnabled = function () {
    return Util.getCookie(PRIVACY_COMMENTO_COOKIE_NAME) === 'On';
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
    const featureToggle = {
        commento: {
            state: isCommentoEnabled(),
            label: "Do you allow the Commento to load?",
            cookie: PRIVACY_COMMENTO_COOKIE_NAME
        },
    };

    LazyLoadImage.init();
    FeatureToggle.init(featureToggle);

    embedWorstPracticeSample();

    if (isCommentoEnabled()) {
        embedCommentoPlugin();
    }
});

document.addEventListener('Component.FeatureToggle.Ready', function () {
    GdprDialog.init();
});
