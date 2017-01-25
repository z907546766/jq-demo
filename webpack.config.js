module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'build.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader',
        }]
    },
   resolve:{
     extensions:[".js",".css"]
   }
}
