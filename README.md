# MultiSelect

A multi-select UI which expands into checkboxes. Accessibility in mind.

## Quick Start

Use HTML like this:

```
<div id="checkboxset-yearsinplace" aria-label="Pick a few">
    <span class="toggle"><label class="small">Pick a few</label> <span class="chevron">&lt;</span></span>
    <fieldset>
        <legend></legend>
        <ul>
            <li><label><input type="checkbox" name="something[]" value="ABC"/> Option One</label></li>
            <li><label><input type="checkbox" name="something[]" value="DEF"/> Option Two</label></li>
            <li><label><input type="checkbox" name="something[]" value="GHI"/> Option Three</label></li>
        </ul>
    </fieldset>
</div>
```

Then JavaScript like this:
```
$('#checkboxset-location').MultiSelect();
```

Or like this to specify options:
```
$('#checkboxset-location').MultiSelect({
    enableToggleAll: true,  // add a "all" option to toggle all choices    
});
```

## QuickStart

The original code was a Codepen by rdmchenry: https://codepen.io/rdmchenry/pen/OyzVEx

GreenInfo Network adapted this to their own use case and added some styling.
- added `<fieldset>` and `<legend>` elements for screen readers
- added `enableToggleAll` option
- changed label behavior
- added an optional Bootstrap 5 stylesheet
