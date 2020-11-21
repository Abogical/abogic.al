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
	if (motionQuery.matches) {
		for (const [type, [fn, opt]] of Object.entries(listened)) {
			window.removeEventListener(type, fn, opt);
		}
	} else {
		let updated = true;
		let x = 0;
		let y = 0;
		let beta = 0;
		let gamma = 0;

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

		addListener('mousemove', event => {
			x = event.clientX;
			y = event.clientY;
			update();
		});

		const setInitBetaAndGamma = event => {
			const initBeta = event.beta;
			const initGamma = event.gamma;
			removeListener('deviceorientation', setInitBetaAndGamma, true);
			addListener(
				'deviceorientation',
				event => {
					beta = event.beta - initBeta;
					gamma = event.gamma - initGamma;
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
