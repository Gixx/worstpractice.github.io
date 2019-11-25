const PRIVACY_DISQUS_COOKIE_NAME = 'privacy_DisqusEnabled';

/**
 * Check whether the Disqus is embeddable.
 *
 * @returns {boolean}
 */
function isDisqusEnabled()
{
    return getCookie(PRIVACY_DISQUS_COOKIE_NAME) === 'Yes';
}

/**
 * Set a cookie.
 *
 * @param {string} cName  Cookie name
 * @param {string} cValue Cookie value
 * @param {number} exDays Expiration days
 */
function setCookie(cName, cValue, exDays)
{
    let date = new Date();
    date.setTime(date.getTime() + (exDays * 24 * 60 * 60 * 1000));
    let expires = "expires="+ date.toUTCString();
    document.cookie = cName + '=' + cValue + ';' + expires + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';secure' : '');
}

/**
 * Retrieve a cookie
 *
 * @param {string} cName Cookie name
 * @returns {string}
 */
function getCookie(cName)
{
    let name = cName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');
    for (let i = 0, num = cookieArray.length; i < num; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
}

/**
 * Embed a worst practice code sample.
 */
function embedWorstPracticeSample()
{
    fetch('/code-of-the-day/0001.html')
        .then(
            function (response) {
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
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    embedWorstPracticeSample();
});
