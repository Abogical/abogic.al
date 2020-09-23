// Dynamicaly importing this doesn't work for some reason :/
import { formatDistance } from 'date-fns';

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

window.addEventListener('load', () => {
	for (let element of document.getElementsByClassName('format-date')) {
		const elementDate = new Date(element.getAttribute('datetime'));
		element.insertAdjacentText('afterend', ` (${formatDistance(elementDate, new Date())} ago)`);
		element.innerHTML = elementDate.toLocaleDateString();
	}
});
