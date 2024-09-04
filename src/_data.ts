const author = {
	'name': 'Abdel-Rahman Abdel-Rahman',
	'htmlName':
		"<span class='no-break'>Abdel-Rahman</span> <span class='no-break'>Abdel-Rahman</span>",
	'role': Deno.env.get('AUTHOR_ROLE') || 'Software Developer',
	'email': Deno.env.get('AUTHOR_EMAIL') || 'abogical@gmail.com',
	'location': Deno.env.get('AUTHOR_LOCATION') || 'Calgary, AB, Canada',
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
