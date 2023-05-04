module.exports = () => ({
	"title": "Abdelrahman Abdelrahman",
	"url": "https://abogic.al/",
	"description": "Abdelrahman Abdelrahman's personal site.",
	"feed": {
		"path": "/feed/feed.xml"
	},
	"author": {
		"name": "Abdelrahman Abdelrahman",
		"email": process.env.AUTHOR_EMAIL || "abdelrahmana@mun.ca",
        "phone": process.env.AUTHOR_PHONE,
        "location": "St. John's, <abbr title=\"Newfoundland and Labrador\">NL</abbr>, Canada"
	}
})
