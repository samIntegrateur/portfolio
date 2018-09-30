module.exports = {
	plugins: {
		'postcss-import': {},
		'postcss-cssnext': {
			browsers: ['last 5 versions'],
			features: {
				rem: false
			}
		},
	},
};
