# MultiSelect

A multiple-choice selector with accessibility in mind.

* Keyboard triggered, focused, and operated.
* Has ARIA indicators used byt screenreaders.
* Lightweight, no dependencies. Even works in IE11.


https://github.com/GreenInfo-Network/MultiSelect

https://greeninfo-network.github.io/MultiSelect/

![image](https://user-images.githubusercontent.com/3117633/168853931-59f36027-02a9-4e9c-bad2-375367082daa.png)



## Quick Start

Use HTML like this:

```
<div id="checkboxset-location" title="Locations">
    <button><span></span><span></span></button>
    <fieldset>
        <div>
            <label><input type="checkbox" name="something[]" value="ABC"/> Option One</label>
            <label><input type="checkbox" name="something[]" value="DEF"/> Option Two</label>
            <label><input type="checkbox" name="something[]" value="GHI"/> Option Three</label>
        </div>
    </fieldset>
</div>
```

Then JavaScript like this:
```
MultiSelect('checkboxset-location', {
    allowSelectAll: "select all/none",
    selectedText: "chosen",
});
```


## Constructor Options

* `allowSelectAll` -- Set the label for the Select All which will be prepended as the first checkbox. You can also set it to `false` or an emptry string, to not add the Select All checkbox.

* `ariaLabel` -- Manually assign an ARIA label. If absent, the element's "title" attribute will be used (if given).

* `selectedText` -- Change the text of the "X selected" readout when options are selected.

* `selectedTextAll` -- Change the text of the "X selected" readout when all options are selected. Default is the "X selected" text described in `selectedText`.


## History & Credits

The original version of this MuliSelect (April 2022) was based on a Codepen by rdmchenry: https://codepen.io/rdmchenry/pen/OyzVEx However, on later testing it really wasn't meeting our accessibility needs for keyboard navigability etc.

In May 2022 the MultiSelect was rewritten from scratch for keyboard nav and a11y from the ground up, and to be a cleaner jQuery function. The code is all original but is based on ideas and behaviors in a Codepen by Allison Ravenhall https://codepen.io/a11yally/pen/vmXPMR.

Also in May 2022, GreenInfo added a few new behaviors such as auto-assigning ARIA labels from the `title` attribute and the "Select all" checkbox, added a demo, rewrote to not use jQuery, and otherwise continued improvement.
