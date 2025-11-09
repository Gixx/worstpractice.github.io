/**
 * Component Repository
 *
 * @returns {*}
 */
const ComponentRepository = function()
{
    const components = {};

    return {
        register: function(name, component) {
            components[name] = component;
        },

        get: function(name) {
            return components[name];
        },

        getAll: function() {
            return components;
        }
    };
};

window['ComponentRepository'] = ComponentRepository