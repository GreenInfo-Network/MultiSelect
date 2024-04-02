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
        selectedText: "selected", // when updateReadout redraws "X selected" this is the wording used
        selectedTextAll: "", // when updateReadout redraws "X selected" and all options are selected, this is the wording used instead
        searchText: "search", // set the label for the search box, or set false to not add it
    }, options);
    this.options.divid = divid;

    // our individual buttons, DIVs, etc.
    const $container = document.getElementById(this.options.divid);
    const $button = $container.querySelector(':scope > button');
    const $readout = $button.querySelector('span:first-of-type');
    const $arrow = $button.querySelector('span:last-of-type');
    const $fieldset = $container.querySelector(':scope > fieldset');
    const $optiondiv = $fieldset.querySelector(':scope > div');
    const $checkboxes = $optiondiv.querySelectorAll('input[type="checkbox"]'); // will not include $selectallcb if added

    // add starting CSS classes
    $container.classList.add('multi-select');

    $arrow.classList.add('multi-select-arrow-collapsed');
    $arrow.setAttribute('aria-hidden', 'true');

    $arrow.classList.add('multi-select-arrow');
    $button.type = 'button';
    $button.setAttribute('aria-expanded', 'false');

    $readout.classList.add('multi-select-readout');

    // if allowSelectAll is enabled, prepend a new checkbox & label to the list, which will toggle all of the real $checkboxes
    let $selectall, $selectallcb;
    if (this.options.allowSelectAll) {
        $selectall = document.createElement('label');
        $selectall.innerHTML = `<input type="checkbox" /> ${this.options.allowSelectAll}`;
        $selectallcb = $selectall.querySelector('input[type="checkbox"]');

		$selectallcb.addEventListener('change', () => {
            for (let i=0; i<$checkboxes.length; i++) {
                $checkboxes[i].checked = $selectallcb.checked;
            }
            updateReadout();
            $selectallcb.focus();
		});

        $optiondiv.insertBefore($selectall, $optiondiv.querySelector('label')); // insert before 1st
    }

    // if searchText is enabled, prepend a text box for searching/filtering
    let $searchtextbox;
    if (this.options.searchText) {
        $searchtextbox = document.createElement('input');
        $searchtextbox.type = 'text';
        $searchtextbox.placeholder = this.options.searchText;
        $searchtextbox.setAttribute('aria-label', this.options.searchText);

        $optiondiv.insertBefore($searchtextbox, $optiondiv.querySelector('label')); // insert before 1st

        $searchtextbox.addEventListener('change', () => filterCheckboxesByTextBox() );
        $searchtextbox.addEventListener('keyup', () => filterCheckboxesByTextBox() );
    }
    function filterCheckboxesByTextBox () {
        const searchtext = $searchtextbox.value;
        filterCheckboxesByText(searchtext);
    }
    function filterCheckboxesByText (searchtext) {
        // case-insensitive search
        searchtext = searchtext.toUpperCase();

        // show/hide the all-none checkbox
        if ($selectall) {
            if (searchtext) {
                $selectall.style.display = 'none';
            } else {
                $selectall.style.display = 'block';
            }
        }

        // show/hide each checkbox
        for (let i=0; i<$checkboxes.length; i++) {
            const $lbl = $checkboxes[i].closest('label');
            const txt = $lbl.innerText.trim().toUpperCase();

            if (searchtext && txt.indexOf(searchtext) === -1) {
                $lbl.style.display = 'none';
            } else {
                $lbl.style.display = 'block';
            }
        }
    }

    // add the click trigger which shows the option list, then hide the options list
    function openOptionsPanel (withfocus) {
        $button.setAttribute('aria-expanded', 'true');
        $fieldset.style.display = 'block';
        $arrow.classList.remove('multi-select-arrow-collapsed');
        $arrow.classList.add('multi-select-arrow-expanded');

        $fieldset.style.width = `${$button.clientWidth}px`;

        if (withfocus) $button.focus();
    }
    function closeOptionsPanel (withfocus) {
        $button.setAttribute('aria-expanded', 'false');
        $fieldset.style.display = 'none';
        $arrow.classList.add('multi-select-arrow-collapsed');
        $arrow.classList.remove('multi-select-arrow-expanded');

        if (withfocus) $button.focus();
    }

    $button.addEventListener('click', () => {
        const showing = $button.getAttribute('aria-expanded') == 'true';
        if (showing) closeOptionsPanel(true);
        else openOptionsPanel(true);
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
            if (howmany == $checkboxes.length && this.options.selectedTextAll) {
                $readout.innerText = `${arialabel}, ${this.options.selectedTextAll}`;
            } else {
                $readout.innerText = `${arialabel}, ${howmany} ${this.options.selectedText}`;
            }
            $button.classList.remove('multi-select--placeholder');
        }

        // $allcb should be checked if any only if all $checkboxes options are checked
        if ($allcb) {
            $allcb.checked = allchecked;
        }
    }

    for (let i=0; i<$checkboxes.length; i++) {
        $checkboxes[i].addEventListener('change', function () {
            updateReadout();
            $checkboxes[i].focus();
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
        else if (document.activeElement == $selectallcb) hasfocus = true;
        else if (document.activeElement == $searchtextbox) hasfocus = true;
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
