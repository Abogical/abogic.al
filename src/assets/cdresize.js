const resize = () => {
	const elem = document.querySelector('.cd > div');
	elem.style.width = window.getComputedStyle(elem).height;
};

window.addEventListener('load', resize);
window.addEventListener('resize', resize);
