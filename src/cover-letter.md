---
layout: layouts/base.vto
styles:
    - assets/resume.css
    - assets/cover-letter.css
footer: false
templateEngine: [vto, md]
---
<main>
{{ include 'layouts/letterhead.vto' }}
<div>

<div id='letter-header'>

<time>

{{ date |> isoDate }}

</time>

Dear XXX,

</div>

Lorem Ipsum

<div id='sign'>

Sincerely,

Abdel-Rahman

</div>
</div>
</main>