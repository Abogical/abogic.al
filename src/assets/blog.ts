import('npm:date-fns').then(({formatDistance}) => {
	window.addEventListener('load', () => {
		for (const element of document.querySelectorAll('.format-date')) {
			const elementDate = new Date(element.getAttribute('datetime'));
			element.insertAdjacentText('afterend', ` (${formatDistance(elementDate, new Date())} ago)`);
			element.innerHTML = elementDate.toLocaleDateString();
		}
	});
});

let updated = true;

const updateSpin = () => {
	document.documentElement.style.setProperty('--spin', `${document.documentElement.scrollTop / 4}deg`);
	updated = true;
};

window.addEventListener('scroll', () => {
	if (updated) {
		updated = false;
		window.requestAnimationFrame(updateSpin);
	}
});
