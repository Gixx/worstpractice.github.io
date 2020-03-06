const PRIVACY_ACCEPT_STORAGE_NAME = 'privacy_Accept_20200109';
const PRIVACY_COMMENTO_STORAGE_NAME = 'privacy_CommentoEnabled';

require('./components/Utility');
require('./components/DataStorage');
require('./components/CookieStorage');
require('./components/FeatureToggleSwitch');
require('./components/LazyLoadImage');
require('./components/GdprDialog');
require('./components/MyClass1');
require('./components/MyClass2');

const utility = new Utility({verbose: true});

/**
 * Embed a "Worst practice" code sample.
 */
const embedWorstPracticeSample = function () {
    const badCodesCounter = 4;
    const badCodes = [];

    for (let i = 1; i <= badCodesCounter; i++) {
        let fileCounter = '' + i;
        badCodes.push(fileCounter.padStart(4, '0') + '.html');
    }

    const date = new Date();
    let day = date.getDate();
    if (day < 10) {
        day = '0' + day;
    }
    let month = (date.getMonth() + 1);
    if (month < 10) {
        month = '0' + month;
    }
    const year = date.getFullYear();
    const today = parseInt(year + '' + month + '' + day);
    const codeOfTheDay = today % badCodes.length;

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
                    const element = event.target;
                    if (element.checked) {
                        scrollTo({ top: 0, behavior: 'smooth' });
                        // scrollTo(0, 0);
                        document.body.style.overflow = 'hidden';
                        document.querySelector('.codeOfTheDay').style.zIndex = '101';
                    } else {
                        document.body.style.overflowY = 'auto';
                        document.body.style.overflowX = 'hidden';
                        document.querySelector('.codeOfTheDay').style.zIndex = '99';
                    }
                });
            });
        }
    });
};

const embedCommentoPlugin = function() {
    const scriptElement = document.createElement('script');
    const commento = document.getElementById('commento');

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
    let dataStorage;

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
