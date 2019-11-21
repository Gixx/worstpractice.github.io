const PRIVACY_DISQUS_COOKIE_NAME = 'privacy_DisqusEnabled';

function isDisqusEnabled()
{
    return getCookie(PRIVACY_DISQUS_COOKIE_NAME) === 'Yes';
}

function setCookie(cName, cValue, exDays)
{
    let date = new Date();
    date.setTime(date.getTime() + (exDays * 24 * 60 * 60 * 1000));
    let expires = "expires="+ date.toUTCString();
    document.cookie = cName + '=' + cValue + ';' + expires + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';secure' : '');
}

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

document.addEventListener('DOMContentLoaded', function () {
    fetch('/code-of-the-day/0002.html')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                // Examine the text in the response
                response.text().then(function (data) {
                    document.querySelector('.h-header__codeOfTheDay').innerHTML = data;
                    document.querySelector('.h-header__codeOfTheDay .drop').addEventListener('click', function (event) {
                        event.stopPropagation();
                        document.querySelector('.h-header__codeOfTheDay').classList.remove('active');
                    });
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
    document.querySelector('.h-header__codeOfTheDay').addEventListener('click', function (event) {
        document.querySelector('.h-header__codeOfTheDay').classList.add('active');
    });
});
