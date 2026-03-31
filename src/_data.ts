const author = {
	'name': 'Abdelrahman Abdelrahman',
	'htmlName':
		"<span class='no-break'>Abdelrahman</span> <span class='no-break'>Abdelrahman</span>",
	'role': Deno.env.get('AUTHOR_ROLE') || 'Software Engineer',
	'email': Deno.env.get('AUTHOR_EMAIL') || 'me@abogic.al',
	'location': Deno.env.get('AUTHOR_LOCATION') || 'Berlin, Germany',
	'phone': Deno.env.get('AUTHOR_PHONE'),
};

export default {
	'date': 'Git Last Modified',
	'metas': {
		'site': "Abdel's site",
		'lang': 'en',
		'author': author.name,
	},
	author,
};
