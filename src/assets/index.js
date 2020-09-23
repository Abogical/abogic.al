let updated = true;

const updateSpin = (x, y) => () => {
	document.documentElement.style.setProperty('--spin', `${x + y}deg`);
	updated = true;
};
window.addEventListener('mousemove', e => {
	if (updated) {
		updated = false;
		window.requestAnimationFrame(updateSpin(e.clientX, e.clientY));
	}
});
