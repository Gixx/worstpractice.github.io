module.exports = {
    entry: "./webpack/entry.js",
    output: {
        path: __dirname + '/src/assets/js/',
        filename: "site.min.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,

            },
        ]
    },
    mode: 'production'
};
