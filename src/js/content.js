// Dependencies
import $ from 'jquery';
import 'fullpage.js/dist/jquery.fullpage';

const htmlEl = document.querySelector('html');

window.onload = function() {

	/**
	 * Onload, trigger landing animation
	 */
	setTimeout( () => {
		htmlEl.classList.add('js-anim-landing');
	}, 200);
};

$(document).ready(function() {

	/**
	 * Full page plugin declaration
	 */
	$('#full-page').fullpage({
		anchors: ['landing', 'section1', 'section2', 'section3', 'infos'],
		menu: '#main-menu',
		scrollingSpeed: 800,
		css3: true,
		easingcss3: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
		responsiveHeight: 670,
		onLeave: function(index, nextIndex, direction) {

			// Handle header/menu visibility
			const $mainHeader = $('#main-header');
			const $mainMenu = $('#main-menu');

			if(nextIndex === 1) {
				$mainHeader.removeClass('js-is-visible');
				$mainMenu.removeClass('js-is-visible');
			} else {
				$mainHeader.addClass('js-is-visible');
				$mainMenu.addClass('js-is-visible');
			}

			// Add class to create some parallax when section comes
			$('.fp-section').removeClass('js-is-coming-down js-is-coming-up');
			$('.fp-section:nth-child('+ nextIndex +')').addClass('is-coming-' + direction);

			// Handle landing anim
			setTimeout(() => {
				if (nextIndex === 1) {
					htmlEl.classList.add('js-anim-landing');
				} else {
					htmlEl.classList.remove('js-anim-landing');
				}
			}, 300);
		},
		afterLoad: function(section) {
			const parallaxItems = document.querySelectorAll('.fp-section:not(.active) .js-parallax');
			parallaxItems.forEach( (parallax) => resetParallax(parallax));
		}
	});

	/**
	 * Mouse move setup
	 * Trigger function depending on a treshold
	 */
	let currentX = '',
		currentY = '';

	/* Keep CPUs to a minimum. */
	const MOUSE_MOVE_THRESHOLD = 25;
	let	lastMouseMoveTime = -1;

	$(document).mousemove(function(e) {
		const now = +new Date;
		if (now - lastMouseMoveTime < MOUSE_MOVE_THRESHOLD) {
			return;
		}
		lastMouseMoveTime = now;
		handleMouseMove(e);
	});

	/**
	 * Handle mouse move
	 * Move elements that have .js-parallax class
	 * @param e : the event returned by mousemouve
	 */
	function handleMouseMove(e) {
		currentX = (currentX) ? currentX : e.pageX;

		const xdiff = e.pageX - currentX;
		currentX = e.pageX;

		currentY = (currentY) ? currentY : e.pageY;

		const ydiff = e.pageY - currentY;
		currentY = e.pageY;

		const parallaxList = document.querySelectorAll('.section.active .js-parallax');
		parallaxList.forEach((item) => {
			const movementConstant = (item.dataset.parallaxLevel * 0.01) || 0.02,
				movementX = (xdiff * movementConstant),
				movementY = (ydiff * movementConstant),
				newX = getComputedTranslate(item, 'x') - movementX,
				newY = getComputedTranslate(item, 'y') - movementY;
			item.style.transform = 'translate(' + newX + 'px, ' + newY + 'px)';
		});

	}

	/**
	 * Reset parallax element position
	 * @param parallax : the parallax element
	 */
	function resetParallax(parallax) {
		parallax.style.transform = '';
	}

	/**
	 * Get computed translate
	 * @param obj : the element to be processed
	 * @param axis : x or y
	 * @returns {number} : the translate value
	 */
	function getComputedTranslate(obj, axis) {
		if (!window.getComputedStyle || (axis !== 'x' && axis !== 'y')) {
			return;
		}

		axis = axis === 'x' ? 4 : 5;

		const style = getComputedStyle(obj),
			transform = style.transform || style.webkitTransform || style.mozTransform;

		const mat = transform.match(/^matrix\((.+)\)$/);
		return mat ? parseFloat(mat[1].split(', ')[axis]) : 0;
	}

	/**
	 * Handle resize event
	 * On resize, reset elements position
	 */
	let resizeTimeout;
	$(window).resize(function(){
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout( () => {

			document.querySelectorAll('.js-parallax').forEach( (object) => {
				object.style.transform = '';
			});

		}, 100);
	});

	const profileLayer = document.querySelector('#profile');
	const btnOpenProfile = document.querySelector('.main-header__profile-button');
	const btnCloseProfile = document.querySelector('.profile__close-button');

	/**
	 * Open profile layer
	 */
	function openProfile() {
		htmlEl.classList.add('js-layer-is-open');
		profileLayer.classList.add('js-is-open');

		setTimeout( () => profileLayer.classList.add('js-anim-end'), 400);
	}

	/**
	 * Close profile layer
	 */
	function closeProfile() {
		htmlEl.classList.remove('js-layer-is-open');
		profileLayer.classList.remove('js-is-open', 'js-anim-end');
	}

	btnOpenProfile.addEventListener('click', openProfile);
	btnCloseProfile.addEventListener('click', closeProfile);

});
