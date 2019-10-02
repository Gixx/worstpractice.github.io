const PRIVACY_DISQUS_COOKIE_NAME = 'privacy_DisqusEnabled';

function isDisqusEnabled()
{
    return getCookie(PRIVACY_DISQUS_COOKIE_NAME) === 'Yes';
}

function setCookie(cname, cvalue, exdays)
{
    let date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+ date.toUTCString();
    let cookieData = cname + '=' + cvalue + ';' + expires + ';path=/;SameSite=Lax' + (location.protocol === 'https:' ? ';secure' : '');
    document.cookie = cookieData;
}

function getCookie(cname)
{
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');
    for(let i = 0, num = cookieArray.length; i < num; i++) {
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
