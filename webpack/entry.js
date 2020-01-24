const PRIVACY_ACCEPT_STORAGE_NAME = 'privacy_Accept_20200109';
const PRIVACY_COMMENTO_STORAGE_NAME = 'privacy_CommentoEnabled';

require('./components/Utility');
require('./components/DataStorage');
require('./components/CookieStorage');
require('./components/FeatureToggleSwitch');
require('./components/LazyLoadImage');
require('./components/GdprDialog');

const utility = new Utility({verbose: true});

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

    utility.fetch({
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
    let dataStorage = null;

    try {
        dataStorage = new DataStorage({utility: utility, verbose: true});
    } catch (e) {
        dataStorage = new CookieStorage({utility: utility, verbose: true});
        dataStorage.renew({key: PRIVACY_ACCEPT_STORAGE_NAME});
        dataStorage.renew({key: PRIVACY_COMMENTO_STORAGE_NAME});
    }

    const isCommentoEnabled = dataStorage.get({key: PRIVACY_COMMENTO_STORAGE_NAME}) === 'On';
    const featureToggleOptions = {
        commento: {
            state: isCommentoEnabled,
            label: "Do you allow the Commento to load?",
            storageKey: PRIVACY_COMMENTO_STORAGE_NAME
        },
    };
    new LazyLoadImage({utility: utility, verbose: true});
    const featureToggle = new FeatureToggleSwitch({utility: utility, storage: dataStorage, options: featureToggleOptions,  verbose: true});
    new GdprDialog({utility: utility, storage: dataStorage, storageKey: PRIVACY_ACCEPT_STORAGE_NAME, featureToggle: featureToggle, verbose: true});

    if (isCommentoEnabled) {
        embedCommentoPlugin();
    }

    embedWorstPracticeSample();

    document.querySelectorAll('a.google').forEach(function (element) {
        element.addEventListener('click', function (event) {
            if (!confirm('This link will take you to a Google Service website.\nDo you really want it?')) {
                event.preventDefault();
                return false;
            }
        })
    })
});
