const path = require('path')
console.log(path.resolve(__dirname, './node_modules/react'))
module.exports = {
    webpack: {
        alias: {
            react: require.resolve("react"),
            'react-dom': require.resolve("react")
            // react0: path.resolve(__dirname, '../node_modules/react'),
            // 'react-dom0': path.resolve(__dirname, '../node_modules/react-dom'),
        },
    },
}