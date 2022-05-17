/**
 * GreenInfo Network MultiSelect
 * https://github.com/GreenInfo-Network/MultiSelect
 * Inspired from code by Allison Ravenhall https://codepen.io/a11yally/pen/vmXPMR
 */

(function($){
   $.fn.MultiSelect = function () {
		const $container = $(this);
		const $button = $container.children('button').first();
		const $readout = $button.children('span').first();
		const $arrow = $button.children('span').last();
		const $fieldset = $container.children('fieldset').first();
		const $optiondiv = $fieldset.children('div').first();
		const $checkboxes = $optiondiv.find('input[type="checkbox"]');

		// add starting CSS classes
		$container.addClass('multi-select');

		$arrow.addClass('fa fa-chevron-down').prop('aria-hidden', 'true');

		$arrow.addClass('multi-select-arrow');
		$button.prop('type', 'button').prop('aria-expanded', 'false');

		$readout.addClass('multi-select-readout');

		// add the click trigger, then hide the options list
		function openOptionsPanel () {
			$button.attr('aria-expanded', 'true');
			$fieldset.css('display', 'block');
			$arrow.addClass('multi-select-arrow--open');
		}
		function closeOptionsPanel () {
			$button.attr('aria-expanded', 'false');
			$fieldset.css('display', 'none');
			$arrow.removeClass('multi-select-arrow--open');
		}

		$button.on('click', function () {
			const showing = $button.attr('aria-expanded') == 'true';
			if (showing) closeOptionsPanel();
			else openOptionsPanel();
		});
		closeOptionsPanel();

		// set ARIA label
		// when checkboxes change, update the button with a readout of how many are selected
		// then call it now to update the readout with the same ARIA label
		const arialabel = $container.attr('title');
		if (arialabel) {
			$button.prop('aria-label', arialabel);
			$fieldset.prop('aria-label', arialabel);
		}

		function updateReadout () {
			const howmany = $checkboxes.filter(':checked').length;
			if (howmany == 0) {
				$readout.text(arialabel);
				$button.addClass('multi-select--placeholder');
			} else {
				$readout.text(`${arialabel}, ${howmany} selected`);
				$button.removeClass('multi-select--placeholder');
			}
		}

		$checkboxes.on('change', function () {
			updateReadout();
		}).first().change();

		// hitting Esc on a checkbox closes the panel & focuses it back
		// so does losing focus
		let unfocused = 0;
		$checkboxes.on('keyup', function (e) {
			if (e.code == 'Escape') {
				closeOptionsPanel();
				$button.focus();
			}
		});
		setInterval(function () {
			const stillfocused = $button.is(':focus') || $fieldset.is(':focus') || $checkboxes.filter(':focus').length;

			if (stillfocused) unfocused = 0;
			else unfocused += 1;
			if (unfocused > 2) closeOptionsPanel();
		}, 0.1 * 1000);

		// done
		return this;
   }; 
})(jQuery);
