const fs = require('fs');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginNavigation = require('@11ty/eleventy-navigation');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const { minify: htmlmin } = require('html-minifier-terser');
const { load } = require('cheerio');
const { formatISO } = require('date-fns');
const brands = require('simple-icons');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight);
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(lazyImagesPlugin, {
		scriptSrc: '/assets/lazyload.min.js'
	});

	eleventyConfig.setDataDeepMerge(true);

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter('head', (array, n) => {
		if (n < 0) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	eleventyConfig.addFilter('ISODate', date => formatISO(date, { representation: 'date' }));

	eleventyConfig.addFilter('hasCode', html => load(html)('code').length > 0);

	eleventyConfig.addFilter('brand', name => brands.get(name).svg);

	eleventyConfig.addCollection('tagList', require('./_11ty/getTagList'));

	eleventyConfig.addPassthroughCopy('src/assets/*.jpg');
	eleventyConfig.addPassthroughCopy({ 'node_modules/lazysizes/lazysizes.min.js': '/assets/lazyload.min.js' });
	eleventyConfig.addWatchTarget('src/assets');

	eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
		if (outputPath)
			if (outputPath.endsWith('.html'))
				return htmlmin(content, {
					useShortDoctype: true,
					removeComments: true,
					collapseWhitespace: true,
					minifyJS: true
				});
		return content;
	});

	/* Markdown Overrides */
	let markdownLibrary = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	}).use(markdownItAnchor, {
		permalink: true,
		permalinkClass: 'direct-link',
		permalinkSymbol: '#'
	});
	eleventyConfig.setLibrary('md', markdownLibrary);

	// Browsersync Overrides
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready: function (err, browserSync) {
				const content_404 = fs.readFileSync('_site/404.html');

				browserSync.addMiddleware('*', (req, res) => {
					// Provides the 404 content without redirect.
					res.write(content_404);
					res.end();
				});
			}
		},
		ui: false,
		ghostMode: false
	});

	return {
		templateFormats: ['md', 'njk', 'html', 'liquid', 'pdf'],

		// If your site lives in a different subdirectory, change this.
		// Leading or trailing slashes are all normalized away, so don’t worry about those.

		// If you don’t have a subdirectory, use "" or "/" (they do the same thing)
		// This is only used for link URLs (it does not affect your file structure)
		// Best paired with the `url` filter: https://www.11ty.io/docs/filters/url/

		// You can also pass this in on the command line using `--pathprefix`
		// pathPrefix: "/",

		markdownTemplateEngine: 'liquid',
		htmlTemplateEngine: 'njk',
		dataTemplateEngine: 'njk',

		// These are all optional, defaults are shown:
		dir: {
			input: 'src',
			includes: '_includes',
			data: '_data',
			output: '_site'
		}
	};
};
