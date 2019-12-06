require('./components/Util');
require('./components/LazyLoadImage');

const PRIVACY_DISQUS_COOKIE_NAME = 'privacy_DisqusEnabled';

/**
 * Check whether the Disqus is embeddable.
 *
 * @returns {boolean}
 */
function isDisqusEnabled()
{
    return window.Util.getCookie(PRIVACY_DISQUS_COOKIE_NAME) === 'Yes';
}

/**
 * Embed a worst practice code sample.
 */
function embedWorstPracticeSample()
{
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
}

document.addEventListener('DOMContentLoaded', function () {
    embedWorstPracticeSample();
    window.Util.init();
    window.LazyLoadImage.init();
});
