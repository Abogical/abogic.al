const htmlnano = require('htmlnano');

module.exports = {
	root: '_site',
	input: '**/*.html',
	output: '_site',
	plugins: [
		require('posthtml-sri')({
			basePath: '_site'
		}),
		htmlnano({
			...htmlnano.presets.max,
			collapseWhitespace: 'aggressive',
			minifySvg: {
				plugins: [{
					name: 'preset-default',
					params: {
						overrides: {
							cleanupIDs: {
								preserve: ['spoke', 'spokeBorder', 'arcify']
							}
						}
					}
				}]
			}
		})
	]
};
