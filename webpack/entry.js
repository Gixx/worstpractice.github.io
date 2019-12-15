require('./components/Util');
require('./components/LazyLoadImage');

const PRIVACY_ACCEPT_COOKIE_NAME = 'privacy_Accept';
const PRIVACY_DISQUS_COOKIE_NAME = 'privacy_DisqusEnabled';

const featureToggle = {
    disqus: {
        state: Util.getCookie(PRIVACY_DISQUS_COOKIE_NAME) === 'Yes',
        label: "Do you allow the Disqus to load??",
    }
};

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
    window.LazyLoadImage.init();
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

document.addEventListener('Component.Util.Ready', function () {
    for (let feature in featureToggle) {
        let target = document.querySelector('.a-featureToggle.-' + feature);
        if (target) {
            let options = featureToggle[feature];
            let checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', 'toggle-' + feature);
            checkbox.setAttribute('checked', options.state);
            checkbox.addEventListener('change', function (event) {
                let element = event.target;
                Util.setCookie(PRIVACY_DISQUS_COOKIE_NAME, element.checked ? 'Yes' : 'No', 365);
            });

            let label = document.createElement('label');
            label.setAttribute('for', 'toggle-' + feature);
            let labelText = document.createTextNode(options.label);
            let labelSwitch = document.createElement('span');
            label.appendChild(labelText);
            label.appendChild(labelSwitch);

            target.appendChild(checkbox);
            target.appendChild(label);
        }
    }
});