import lume from 'lume/mod.ts';
import attributes from 'lume/plugins/attributes.ts';
import code_highlight from 'lume/plugins/code_highlight.ts';
import date from 'lume/plugins/date.ts';
import esbuild from 'lume/plugins/esbuild.ts';
import favicon from 'lume/plugins/favicon.ts';
import feed from 'lume/plugins/feed.ts';
import nav from 'lume/plugins/nav.ts';
import picture from 'lume/plugins/picture.ts';
import transformImages from 'lume/plugins/transform_images.ts';
import metas from 'lume/plugins/metas.ts';
import sitemap from 'lume/plugins/sitemap.ts';
import svgo from 'lume/plugins/svgo.ts';
import terser from 'lume/plugins/terser.ts';
import sourceMaps from 'lume/plugins/source_maps.ts';
import postcss from 'lume/plugins/postcss.ts';
import cssnano from 'npm:cssnano';
import postCssPresetEnv from 'npm:postcss-preset-env';
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts';
import minifyHTML from 'lume/plugins/minify_html.ts';

const portStr = Deno.env.get('port');
const port = portStr ? parseInt(portStr) : 3000;

const site = lume({
	src: './src',
	server: {
		port,
	},
});

site.use(attributes());
site.use(code_highlight());
site.use(date());
site.use(esbuild());
site.use(favicon());
site.use(feed());
site.use(nav());
site.use(svgo());
site.use(picture());
site.use(transformImages());
site.use(metas());
site.use(terser());
site.use(sitemap());
site.use(minifyHTML());

site.use(postcss({
	plugins: [
		postCssPresetEnv({
			stage: 0,
		}),
		cssnano(),
	],
}));

site.use(sourceMaps());

site.copy('external');

const buildResumePDF = async () => {
	console.log('building PDF resume');
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('http://127.0.0.1:3000/resume/');
	await page.pdf({
		path: '_site/resume.pdf',
		format: 'A4',
		pageRanges: '1',
	});
	await browser.close();
	console.log('PDF resume built');
	if (Deno.env.get('TERMINATE_AFTER_BUILD')) {
		Deno.exit();
	}
};

site.addEventListener('afterStartServer', buildResumePDF);

const resumeFiles = new Set([
	'/resume/',
	'/assets/resume.css',
	'/assets/global.css',
]);
site.addEventListener('afterUpdate', (event) => {
	for (const page of event.pages) {
		if (resumeFiles.has(page.data.url)) {
			buildResumePDF();
		}
	}
});

export default site;
