var path = require('path');

module.exports = {
    components: 'components/**/*.tsx',
    title: 'GAT UI Style Guide',
    propsParser: require('react-docgen-typescript').parse,
    webpackConfig: {
        module: {
            loaders: [
                {
                    test: /\.tsx$/,
                    use: 'awesome-typescript-loader'
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader?modules', 'sass-loader']
                }
            ]
        }
    },
};
