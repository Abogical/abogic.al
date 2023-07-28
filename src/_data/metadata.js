module.exports = () => ({
	"title": "Abdel-Rahman Abdel-Rahman",
	"url": "https://abogic.al/",
	"description": "Abdel-Rahman's personal site.",
	"feed": {
		"path": "/feed/feed.xml"
	},
	"author": {
        "htmlName": "<span class='no-break'>Abdel-Rahman</span> <span class='no-break'>Abdel-Rahman</span>",
		"name": "Abdel-Rahman Abdel-Rahman",
        "role": process.env.AUTHOR_ROLE || "Software Developer",
		"email": process.env.AUTHOR_EMAIL || "abdelrahmana@mun.ca",
        "phone": process.env.AUTHOR_PHONE,
        "location": "St. John's, <abbr title=\"Newfoundland and Labrador\">NL</abbr>, Canada"
	}
})
