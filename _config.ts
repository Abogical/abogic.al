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
import cssnano from 'npm:cssnano@^7.0.6';
import postCssPresetEnv from 'npm:postcss-preset-env@^10.1.3';
import puppeteer, { Browser } from 'npm:puppeteer@^24.2.0';
import minifyHTML from 'lume/plugins/minify_html.ts';
import { join } from 'jsr:@std/path';
import { formatISO } from 'npm:date-fns@4.1.0';

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
site.copy(['.pdf']);

site.filter('isoDate', (date) => formatISO(date, { representation: 'date' }));

// Metas plugin bug fix, where the links are incorrectly localhost.
site.process(['.html'], (pages) => {
	for (const page of pages) {
		for (
			const meta of page.document!.querySelectorAll(
				'[property="og:image"], [property="og:url"]',
			)
		) {
			meta.setAttribute(
				'content',
				meta.getAttribute('content')!.replace(
					'http://localhost:3000',
					'https://abogic.al',
				),
			);
		}
	}
});

if (Deno.env.get('BUILD_MODE')) {
	site.ignore('cover-letter.md');
}

const buildResumePDF = async (browser: Browser) => {
	const page = await browser.newPage();
	await page.goto('http://localhost:3000/resume/', {waitUntil: 'load', timeout: 0});
	await Deno.writeFile(
		'_site/resume.pdf',
		new Uint8Array(await page.pdf({
			format: 'A4',
			pageRanges: '1',
		})),
	);
	await page.close();
};

const screenshotPage = async (
	browser: Browser,
	url: string,
	destination: string,
) => {
	const page = await browser.newPage();
	await page.emulateMediaFeatures([
		{ name: 'prefers-color-scheme', value: 'light' },
	]);
	await page.setViewport({
		width: 600,
		height: 300,
	});
	await page.goto(join('http://localhost:3000', url), {waitUntil: 'load', timeout: 0});
	await page.screenshot({
		path: join('_site', destination),
	});
	await page.close();
};

const puppeteerTasks = async () => {
	console.log('Running puppeteer tasks');
	const browser = await puppeteer.launch();

	const tasks = [];
	tasks.push(buildResumePDF(browser));
	const screenshots_urls = [
		'/assets/index-og-image.css',
	];

	for (const page of site.pages) {
		if ('screenshot' in page.data) {
			tasks.push(screenshotPage(browser, page.data.url, page.data.screenshot));
			screenshots_urls.push(page.data.url);
		}
	}

	await Promise.all(tasks);
	await browser.close();
	console.log('Puppeteer tasks done');
	if (Deno.env.get('BUILD_MODE')) {
		await Promise.all(
			screenshots_urls.map((url) =>
				Deno.remove(join('_site', url), { recursive: true })
			),
		);
		Deno.exit();
	}
};

site.addEventListener('afterStartServer', puppeteerTasks);

const puppeteerFiles = new Set([
	'/resume/',
	'/assets/resume.css',
	'/assets/global.css',
]);
site.addEventListener('afterUpdate', (event) => {
	for (const page of event.pages) {
		if (puppeteerFiles.has(page.data.url) || 'screenshot' in page.data) {
			puppeteerTasks();
			break;
		}
	}
});

Deno.addSignalListener('SIGINT', () => {
	Deno.exit();
});

export default site;
