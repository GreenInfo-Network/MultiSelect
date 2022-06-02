/**
 * GreenInfo Network MultiSelect
 * https://github.com/GreenInfo-Network/MultiSelect
 * Inspired from code by Allison Ravenhall https://codepen.io/a11yally/pen/vmXPMR
 */

const MultiSelect = (divid, options={}) => {
    // set our options & defaults
    this.options = Object.assign({
        allowSelectAll: "Select all/none", // set the label for the Select All option, or set false to not add it
        ariaLabel: undefined, // manually assign an ARIA label; if absent, will use the element's "title" attribute
    }, options);
    this.options.divid = divid;

    // our individual buttons, DIVs, etc.
    const $container = document.getElementById(this.options.divid);
    const $button = $container.querySelector(':scope > button');
    const $readout = $button.querySelector('span:first-of-type');
    const $arrow = $button.querySelector('span:last-of-type');
    const $fieldset = $container.querySelector(':scope > fieldset');
    const $optiondiv = $fieldset.querySelector(':scope > div');
    const $checkboxes = $optiondiv.querySelectorAll('input[type="checkbox"]'); // will not include $allcb if added

    // add starting CSS classes
    $container.classList.add('multi-select');

    $arrow.classList.add('multi-select-arrow-collapsed');
    $arrow.setAttribute('aria-hidden', 'true');

    $arrow.classList.add('multi-select-arrow');
    $button.type = 'button';
    $button.setAttribute('aria-expanded', 'false');

    $readout.classList.add('multi-select-readout');

    // if allowSelectAll is enabled, prepend a new checkbox & label to the list, which will toggle all of the real $checkboxes
    let $allcb;
    if (this.options.allowSelectAll) {
        const $all = document.createElement('label');
        $all.innerHTML = `<input type="checkbox" /> ${this.options.allowSelectAll}`;
        $allcb = $all.querySelector('input[type="checkbox"]');

		$allcb.addEventListener('change', () => {
            for (let i=0; i<$checkboxes.length; i++) {
                $checkboxes[i].checked = $allcb.checked;
            }
            updateReadout();
		});

        $optiondiv.insertBefore($all, $optiondiv.querySelector('label')); // insert before 1st
    }

    // add the click trigger which shows the option list, then hide the options list
    function openOptionsPanel () {
        $button.setAttribute('aria-expanded', 'true');
        $fieldset.style.display = 'block';
        $arrow.classList.remove('multi-select-arrow-collapsed');
        $arrow.classList.add('multi-select-arrow-expanded');

        $fieldset.style.width = `${$button.clientWidth}px`;
    }
    function closeOptionsPanel () {
        $button.setAttribute('aria-expanded', 'false');
        $fieldset.style.display = 'none';
        $arrow.classList.add('multi-select-arrow-collapsed');
        $arrow.classList.remove('multi-select-arrow-expanded');
    }

    $button.addEventListener('click', () => {
        const showing = $button.getAttribute('aria-expanded') == 'true';
        if (showing) closeOptionsPanel();
        else openOptionsPanel();
    });
    closeOptionsPanel();


    // set ARIA label
    // when checkboxes change, update the button with a readout of how many are selected
    // then call it now to update the readout with the same ARIA label
    const arialabel = options.AriaLabel ? options.AriaLabel : ($container.getAttribute('title') ? $container.getAttribute('title') : "");
    $button.setAttribute('aria-label', arialabel);

    $fieldset.setAttribute('aria-label', arialabel);

    const $legend = document.createElement('legend');
    $legend.innerText = "Select options";
    $fieldset.insertBefore($legend, $optiondiv);

    function updateReadout () {
        let howmany = 0;
        for (let i=0; i<$checkboxes.length; i++) {
            if ($checkboxes[i].checked) howmany += 1;
        }

        if (howmany == 0) {
            $readout.innerText = arialabel;
            $button.classList.add('multi-select--placeholder');
        } else {
            $readout.innerText = `${arialabel}, ${howmany} selected`;
            $button.classList.remove('multi-select--placeholder');
        }
    }

    for (let i=0; i<$checkboxes.length; i++) {
        $checkboxes[i].addEventListener('change', function () {
            updateReadout();
        });
    }
    updateReadout();

    // hitting Esc on a checkbox closes the panel & focuses it back
    // so does losing focus
    let unfocused = 0;
    for (let i=0; i<$checkboxes.length; i++) {
        $checkboxes[i].addEventListener('keyup', (event) => {
            if (event.code == 'Escape') {
                closeOptionsPanel();
                $button.focus();
            }
        });
    }

    setInterval(() => {
        let hasfocus = false;
        if (document.activeElement == $button) hasfocus = true;
        else if (document.activeElement == $fieldset) hasfocus = true;
        else if (document.activeElement == $allcb) hasfocus = true;
        else {
            for (let i=0; i<$checkboxes.length; i++) {
                if (document.activeElement == $checkboxes[i]) { hasfocus = true; break; }
            }
        }

        if (hasfocus) unfocused = 0;
        else unfocused += 1;
        if (unfocused > 2) closeOptionsPanel();
    }, 0.1 * 1000);
};
