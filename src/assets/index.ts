const motionQuery = window.matchMedia('(prefers-reduced-motion)');

let listened: Record<
	string,
	[(event: any) => void, undefined | boolean | EventListenerOptions]
> = {};

const addListener = (
	type: string,
	fn: (event: any) => void,
	opt?: undefined | boolean | EventListenerOptions,
) => {
	window.addEventListener(type, fn, opt);
	listened[type] = [fn, opt];
};

const removeListener = (
	type: string,
	fn: (event: any) => void,
	opt?: undefined | boolean | EventListenerOptions,
) => {
	window.removeEventListener(type, fn, opt);
	delete listened[type];
};

const queryChange = () => {
	if (motionQuery.matches) {
		for (const [type, [fn, opt]] of Object.entries(listened)) {
			window.removeEventListener(type, fn, opt);
		}
		listened = {};
	} else {
		let updated = true;
		let x = 0;
		let y = 0;
		let alpha = 0;
		let beta = 0;
		let gamma = 0;

		const update = () => {
			if (updated) {
				updated = false;
				window.requestAnimationFrame(() => {
					document.documentElement.style.setProperty(
						'--spin',
						`${
							(180 / Math.PI) *
								Math.atan2(
									window.innerHeight / 2 - y,
									window.innerWidth / 2 - x,
								) +
							(alpha + beta + gamma) * 4
						}deg`,
					);
					updated = true;
				});
			}
		};

		addListener('mousemove', (event: MouseEvent) => {
			x = event.clientX;
			y = event.clientY;
			update();
		});

		const setInitAlphaBetaAndGamma = (event: DeviceOrientationEvent) => {
			const initAlpha = event.alpha;
			const initBeta = event.beta;
			const initGamma = event.gamma;
			removeListener('deviceorientation', setInitAlphaBetaAndGamma, true);
			addListener(
				'deviceorientation',
				(event: DeviceOrientationEvent) => {
					alpha = event.alpha - initAlpha;
					beta = event.beta - initBeta;
					gamma = event.gamma - initGamma;
					update();
				},
				true,
			);
		};

		addListener('deviceorientation', setInitAlphaBetaAndGamma, true);
	}
};

queryChange();
motionQuery.addEventListener('change', queryChange);
