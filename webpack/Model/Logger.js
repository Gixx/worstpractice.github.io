
/**
 * Logger component.
 *
 * @param {string} componentName
 * @param {string} colorId
 * @returns {*}
 */
const Logger = function (componentName, colorId)
{
    /** @type {string} */
    const consoleLabelTextColorId = '#599bd6';
    const verbose = false;

    const loggerInitialized = function () {
        verbose && console.info(
            '%c[Logger]%c ✔%c A new instance is created for %o %ccomponent.',
            'background:Indigo;color:white;font-weight:bold;',
            'color:green; font-weight:bold;',
            'color:'+consoleLabelTextColorId+'; font-weight:bold;',
            componentName,
            'color:'+consoleLabelTextColorId+'; font-weight:bold;',
        );
    }

    loggerInitialized();

    return {
        warn: function (message, exception = null) {
            console.warn(message, exception);
        },

        error: function (message, exception = null) {
            console.error(message, exception);
        },

        actionTriggered: function (message, subject) {
            console.info(
                '%c['+componentName+']%c ⚡%c '+message+': %o',
                'background:'+colorId+';color:black;font-weight:bold;',
                'color:orange;font-weight:bold',
                'color:'+consoleLabelTextColorId+';font-style:italic',
                subject
            );
        },

        actionSuccess: function (message, data = '') {
            console.info(
                '%c['+componentName+']%c ✔%c '+message+'. %o',
                'background:'+colorId+';color:black;font-weight:bold;',
                'color:green;font-weight:bold',
                'color:'+consoleLabelTextColorId+';font-style:italic',
                data
            );
        },

        actionFailed: function (message, error = 'null') {
            console.info(
                '%c['+componentName+']%c ✖%c '+message+': %o',
                'background:'+colorId+';color:black;font-weight:bold;',
                'color:red',
                'color:'+consoleLabelTextColorId+';font-style:italic',
                error
            );
        },

        componentLoaded: function () {
            console.info(
                '%c['+componentName+']%c ✔%c The '+componentName+' component loaded.',
                'background:'+colorId+';color:black;font-weight:bold;',
                'color:green; font-weight:bold;',
                'color:'+consoleLabelTextColorId+'; font-weight:bold;'
            );
        },

        seekComponentElements: function () {
            console.info(
                '%c['+componentName+']%c ೱ%c looking for '+componentName+' elements.',
                'background:'+colorId+';color:black;font-weight:bold;',
                'color:lightBlue; font-weight:bold;',
                'color:'+consoleLabelTextColorId+';font-style:italic'
            );
        },

        componentElementsNotFound: function () {
            console.info(
                '%c['+componentName+']%c ✖%c No component elements found for '+componentName+'.',
                'background:'+colorId+';color:black;font-weight:bold;',
                'color:red; font-weight:bold;',
                'color:'+consoleLabelTextColorId+';font-style:italic'
            );
        },

        componentElementInitSuccess: function (elementId) {
            console.info(
                '%c['+componentName+']%c ✚%c a '+componentName+' element initialized %o',
                'background:'+colorId+';color:black;font-weight:bold;',
                'color:green; font-weight:bold;',
                'color:'+consoleLabelTextColorId+';font-style:italic',
                '#'+elementId
            );
        }
    };
};

window['Logger'] = Logger;