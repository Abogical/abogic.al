let updated = true;
let x = 0,
	y = 0,
	beta = 0,
	gamma = 0;

const update = () => {
	if (updated) {
		updated = false;
		window.requestAnimationFrame(() => {
			document.documentElement.style.setProperty(
				'--spin',
				`${
					(180 / Math.PI) * Math.atan2(window.innerHeight / 2 - y, window.innerWidth / 2 - x) +
					(beta + gamma) * 4
				}deg`
			);
			updated = true;
		});
	}
};

window.addEventListener('mousemove', e => {
	x = e.clientX;
	y = e.clientY;
	update();
});

const setInitBetaAndGamma = e => {
	const initBeta = e.beta;
	const initGamma = e.gamma;
	window.removeEventListener('deviceorientation', setInitBetaAndGamma, true);
	window.addEventListener('deviceorientation', e => {
		beta = e.beta - initBeta;
		gamma = e.gamma - initGamma;
		update();
	});
};

window.addEventListener('deviceorientation', setInitBetaAndGamma, true);
