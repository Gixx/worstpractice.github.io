const PRIVACY_ACCEPT_STORAGE_NAME = 'privacy_Accept_20251119';

require('./Model/Logger');
require('./Model/Utility');
require('./Model/Http');
require('./Model/SmoothScroll');

require('./Repository/LocalStorage');
require('./Repository/CookieStorage');

require('./Components/Elements/FeatureToggleSwitchElement');
require('./Components/FeatureToggleSwitch');

require('./Components/Elements/LazyLoadImageElement');
require('./Components/LazyLoadImage');

require('./Components/Elements/DialogWindowElement');
require('./Components/DialogWindow');

require('./Components/Elements/BarChartElement');
require('./Components/BarChart');

require('./Components/Elements/CollapsibleElement');
require('./Components/Collapsible');

require('./ComponentRepository');

document.addEventListener('DOMContentLoaded', function () {
    globalThis.Components = new ComponentRepository();
    globalThis.Components.register('utility', new Utility());
    globalThis.Components.register('http', new Http());

    let dataStorage;
    try {
        dataStorage = new LocalStorage();
    } catch (e) {
        console.error(e);
        dataStorage = new CookieStorage();
        dataStorage.renew(PRIVACY_ACCEPT_STORAGE_NAME);
    }
    globalThis.Components.register('dataStorage', dataStorage);
    globalThis.Components.register('smoothScroll', new SmoothScroll());
    globalThis.Components.register('lazyLoadImage', new LazyLoadImage());
    globalThis.Components.register('barChart', new BarChart());
    globalThis.Components.register('collapsible', new Collapsible());

    const featureToggleOptions = {};

    globalThis.Components.register('featureToggle', new FeatureToggleSwitch(featureToggleOptions));

    Promise.allSettled(fetchAllDialogs()).then(function(response) {
        globalThis.Components.register('dialogWindow', new DialogWindow());
    });

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

/**
 * Open the dialog as soon as the Component is ready
 */
document.addEventListener('Component.DialogWindow.Ready', function() {
    const gdprDialog = globalThis.Components.get('dialogWindow').getDialogWindowElementByName('gdpr');

    if (gdprDialog) {
        gdprDialog.open();
        gdprDialog.getHTMLElement().addEventListener('Component.Dialog.Action.Save', function() {
            globalThis.Components.get('dataStorage').set('gdpr', 'On', false)
        });
        gdprDialog.getHTMLElement().addEventListener('Component.Dialog.Action.Close', function() {
            globalThis.Components.get('dataStorage').set('gdpr', 'On', false)
        });
    }
});

/**
 *Add smooth scroll function for content anchor link.
 */
document.addEventListener('Component.SmoothScroll.Ready', function() {
    const scrollToContentButton = document.querySelector('.m-menu__link.-downarrow');

    if (scrollToContentButton) {
        scrollToContentButton.addEventListener('click', function(event){
            event.preventDefault();

            globalThis.Components.get('smoothScroll').scrollToElementById('content', 10);
        });
    }
});

/**
 * Fetches all the dialog HTML data.
 *
 * @return {[]}
 */
const fetchAllDialogs = function() {
    let promises = [];
    const http = globalThis.Components.get('http');
    const dataStorage = globalThis.Components.get('dataStorage');
    const dialogDisplayOnceForLife = [
        'gdpr'
    ];

    const wrapperId = 'dialogWrapper_'+Math.ceil(Math.random()*1000000000);
    let dialogWrapper = document.getElementById(wrapperId);

    if (!dialogWrapper) {
        dialogWrapper = document.createElement('div');
        dialogWrapper.setAttribute('id', wrapperId);
        document.body.appendChild(dialogWrapper);
    }

    for (let i = 0, num = dialogDisplayOnceForLife.length; i < num; i++) {
        if (dataStorage.get(dialogDisplayOnceForLife[i]) !== 'On') {
            promises.push(http.fetch(
                '/dialogs/'+dialogDisplayOnceForLife[i]+'.html',
                'GET',
                true,
                'text/html',
                {},
                function (response) {
                    return response.text().then(function (data) {

                        dialogWrapper.innerHTML += data;

                        return new Promise((resolve, reject) => {
                            resolve('done');
                        });
                    });
                })
            );
        }
    }

    return promises;
};

/**
 * Embed a "Worst practice" code sample.
 */
const embedWorstPracticeSample = function () {
    const http = globalThis.Components.get('http');
    const badCodesCounter = 5;
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

    http.fetch(
        '/code-of-the-day/' + badCodes[codeOfTheDay],
        'GET',
        true,
        'text/html',
        {},
        function (response) {
            if (response.status !== 200) {
                console.warn('Looks like there was a problem. Status Code: ' + response.status);
                return;
            }

            // Examine the text in the response
            response.text().then(function (data) {
                document.querySelector('.codeOfTheDay__content').innerHTML = data;
                document.querySelector('input.codeOfTheDay__toggle').addEventListener('click', function (event) {
                    /** @type HTMLInputElement */
                    const element = event.target;
                    if (element.checked) {
                        document.body.style.overflow = 'hidden';
                        document.querySelector('.codeOfTheDay').style.zIndex = '101';
                    } else {
                        document.body.style.overflowY = 'auto';
                        document.body.style.overflowX = 'hidden';
                        document.querySelector('.codeOfTheDay').style.zIndex = '99';
                    }
                });
            });
        },
        null
    );
};