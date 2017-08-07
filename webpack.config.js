var path = require('path');

module.exports = {
    entry: [
      path.resolve(__dirname, 'app/index.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
    },
    resolve: {
	    extensions: ['.js', '.jsx']
	},
	module: {
      rules: [
        {
        	test: /\.(js|jsx)$/,
            loaders: 'babel-loader',
            exclude: /node_modules/,
            query: {
              presets: ['es2015', 'stage-1', 'react'],
            }
        }
      ]
    }
};