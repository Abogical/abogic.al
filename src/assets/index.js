const motionQuery = window.matchMedia('(prefers-reduced-motion)');

const listened = {};

const addListener = (type, fn, opt) => {
	window.addEventListener(type, fn, opt);
	listened[type] = [fn, opt];
};

const removeListener = (type, fn, opt) => {
	window.removeEventListener(type, fn, opt);
	delete listened[type];
};

const queryChange = () => {
	if (motionQuery.matches)
		for (const [type, [fn, opt]] of Object.entries(listened)) window.removeEventListener(type, fn, opt);
	else {
		let updated = true,
			x = 0,
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

		addListener('mousemove', e => {
			x = e.clientX;
			y = e.clientY;
			update();
		});

		const setInitBetaAndGamma = e => {
			const initBeta = e.beta;
			const initGamma = e.gamma;
			removeListener('deviceorientation', setInitBetaAndGamma, true);
			addListener(
				'deviceorientation',
				e => {
					beta = e.beta - initBeta;
					gamma = e.gamma - initGamma;
					update();
				},
				true
			);
		};

		addListener('deviceorientation', setInitBetaAndGamma, true);
	}
};

queryChange();
motionQuery.addEventListener('change', queryChange);
