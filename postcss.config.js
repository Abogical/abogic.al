const path = require('path');
const fs = require('fs');

module.exports = {
	plugins: [
		require('postcss-nested'),
		require('postcss-import'),
		require('postcss-preset-env')({
			stage: 0
		}),
		...(process.env.NODE_ENV === 'production'
			? [
					require('@fullhuman/postcss-purgecss')({
						content: ['./_site/**/*.html']
					})
			  ]
			: []),
		require('postcss-url')({
			// Workaound until https://github.com/postcss/postcss-url/issues/121 is fixed.
			url: ({ absolutePath }) => {
				const urlPath = path.join('assets', path.basename(absolutePath));
				fs.copyFileSync(absolutePath, path.join('./_site/', urlPath));
				return urlPath;
			}
		}),
		require('cssnano')({
			preset: [
				'advanced',
				{
					discardComments: {
						removeAll: true
					},
					reduceIdents: false,
					autoprefixer: false
				}
			]
		}),
		require('postcss-reporter')({
			clearReportedMessages: true
		})
	]
};
