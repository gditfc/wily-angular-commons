# Wily Angular Commons

This package offers a small selection of reusable components that interoperate with the rest of GDIT's Wily offering. If you're interested in contributing or find any bugs, feel free to catch us on GitHub.

## WilyColorPickerModule
### ColorPickerComponent
The color picker component is a simple way to choose/input a color in hexadecimal format. It offers a text input that allows for free entry in hexadecimal format along with a color picker for supported browsers. If the browser does not support the HTML5 color picker, it is replaced with a simple color swatch that acts as a preview of the contents of the text input.
#### Usage
The color picker accepts a hexadecimal color string (either in short or full form, leading `#` optional, case is ignored) through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the color picker, you can listen for its `ngModelChange` event (if using `ngModel`) or its `colorSelected` event. The value emitted from the component is a full hexadecimal color string (ex: #0a50d3). Model updates on every color picker input, every valid text input entry and when the contents of the text input are deleted by the user.
#### Selector: wily-color-picker
#### Inputs
- value: setter for the internal value of the component
- disabled: whether the component should be disabled
- ariaLabel: the aria label to set for the color picker/text input
- classList: CSS class list to apply to the text input
#### Outputs
- input: event emitted on text input, emits the current value of the component
- colorSelected: event emitted on color picker close or on valid hexadecimal string input from the text input, emits the selected color as a hexadecimal string

## WilyDatePickerModule
### DatePickerComponent
The date picker component allows the user to enter a date via a text input (in the form of month/day/year) or through a calendar widget.
#### Usage
The date picker accepts a Date object through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the date picker, you can listen for its `ngModelChange` event (if using `ngModel`) or its `dateSelected` event. The value emitted from the component is a Date object representing the user's typed/selected date. Model updates on every calendar widget selection, every valid text input entry and when the contents of the text input are deleted by the user.
#### Selector: wily-date-picker
#### Inputs
- value: setter for the internal value of the component
- disabled: whether the component should be disabled
- dateRange: object in the form of `{ minDate: Date, maxDate: Date}` that acts as the valid selection range for the input/calendar widget. Min date must be less than max date. If min date is not provided, the min date is set to January 1st, {currentYear - 100}. If max date is not provided, the max date is set to December 31st, {current year + 50}.
- inputId: the ID to assign to the text input
- ariaLabel: the aria label to assign to the text input
- inputClassList: CSS class list to apply to the text input
- calendarButtonClassList: CSS class list to apply to the calendar widget button
#### Outputs
- input: event emitted on text input
- dateSelected: event emitted on valid date input/widget date selection, emits the selected date
### CalendarComponent
The calendar component displays a calendar widget with accessibility features such as arrow key navigation of calendar dates.
#### Usage
The calendar accepts a Date object through its `value` input. To read in the value of the calendar, you can listen for its `selected` event. The value emitted from the component is a Date object representing the user's selection.
#### Selector: wily-calendar
#### Inputs
- value: setter for the internal value of the component
- dateRange: object in the form of { minDate: Date, maxDate: Date} that acts as the valid selection range for the calendar. Min date must be less than max date. If min date is not provided, the min date is set to January 1st, {currentYear - 100}. If max date is not provided, the max date is set to December 31st, {current year + 50}.
#### Outputs
- selected: event emitted on calendar date selection, emits the selected date
- closed: event emitted when the user clicks outside of the widget, triggers a keyup.escape event or clicks the done button. It is the parent component's responsibility to hide the calendar, the event is merely a signal that action should be taken.

## WilyDialogModule
### DialogComponent
The dialog component displays dynamic content within a dialog and supports nested dialogs within that dynamic content.
#### Usage
The dialog component essentially wraps an `ng-content` block. It is the responsibility of the parent component to show/hide the dialog based on its `object` input and `closed` event. The dialog listens for `keyup.escape` events (if enabled) to trigger a dialog close. If you have components in the dynamic dialog content that also rely on escape events to close, those components must listen for keyups on its own focusable elements (as opposed to listening for `window.keyup`) and either stop immediate propagation, or those focusable elements must have the `data-dialog-close-override` attribute on them, or else the escape event will close both the child component and the parent dialog.
#### Selector: wily-dialog
#### Inputs
- object: an input of type `any` where that input becoming truthy will show the dialog and falsy will hide
- title: the title of the dialog. Note: always use the Angular input syntax (`[title]="'Title'"`) to avoid IE11 triggering a native tooltip of the dialog title
- titleClass: CSS class to apply to the title section of the dialog
- bodyClass: CSS class to apply to the body section of the dialog
- showTitle: whether to show the title section of the dialog (default `true`)
- allowClose: whether to show the dialog close button and enable escape to close (default `true`)
- height: the height of dialog (can be any valid CSS measurement)
- width: the width of dialog (can be any valid CSS measurement)
#### Outputs
- opened: event emitted on dialog open
- closed: event emitted on dialog close

## WilyDropdownModule
### DropdownComponent
The dropdown component acts as an enhanced HTML select. It supports both regular dropdown options (only the label being displayed) and templated options (options for which you can supply a ng-template to act as a template for each dropdown option). The dropdown is fully accessible as well, and supports all the accessibility options that a native select would (such as arrow key controls for option selection).
#### Usage
The dropdown accepts a string or number through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the dropdown, you can listen for its `ngModelChange` event (if using `ngModel`) or its `change` event. The value emitted from the component is a string or number representing the value of the user's selected option. Model updates on every option change, whether it be triggered by clicking on an option or using arrow key controls.
#### Using Dropdown Options
The dropdown supports both flat options or option groups, and the options for a single dropdown can be a mix of the two. A dropdown option has a value (string or number), a label, disabled indicator, and an optional data context object (the data context object is not needed if you're not planning to use templating). Whether data context is passed in or not for an option, each option internally will have a data context object which will minimally contain the option's label (inserted into the `$implicit` property if not already taken, or the `label` property if `$implicit` is already present in the object). Dropdown option groups contain a group label, and an array of dropdown options.
#### Using Dropdown Option Templating
Dropdown option templating relies on Angular's `ng-template` syntax. To provide an option template to the dropdown, you simply define a `ng-template` as the content of the dropdown. If you do not wish to use templating, pass nothing into the content between the dropdown tags. To display data from an option's data context within the option template, you use Angular's `ng-template` `let-var` syntax. This allows you to define variables within the option template that will then be filled by the corresponding property in an option's data context. As mentioned in the previous section, the option's label is automatically added to each option's data context, so to display the label in the template, you can just define a variable without a value, and it will be filled by the `$implicit` entry. Here's an example of how a typical use case of the dropdown with templating would look:

```html
  <wily-dropdown [options]="[
                    { value: 'red', label: 'Red', dataContext: { 'colorClass': 'bg_red' } },
                    { value: 'green', label: 'Green', disabled: true, dataContext: { 'colorClass': 'bg_green' } },
                    { value: 'blue', label: 'Blue', dataContext: { 'colorClass': 'bg_blue' } },
                    { groupLabel: 'Purple Values', options: [
                        { value: 'darkPurple', label: 'Dark Purple', dataContext: { 'colorClass': 'bg_purple_dark_4' } },
                        { value: 'purple', label: 'Purple', dataContext: { 'colorClass': 'bg_purple' } },
                        { value: 'lightPurple', label: 'Light Purple', dataContext: { 'colorClass': 'bg_purple_light_4' } }
                    ]}
                 ]">
    <ng-template let-colorClass="colorClass" let-label>
      <div class="circle_14px mar_right5"
           [ngClass]="colorClass">
      </div> {{label}}
    </ng-template>
  </wily-dropdown>
```
Notice how, in the `ng-template`, the variable definition value (in quotes) for `colorClass` matches up with the property of the same name in the data context objects for each option. Also notice how the variable definition for `label` has no value assigned, that's because the dropdown component will automatically put an option's label into the `$implicit` property, which Angular uses to fill in the value for any referenced variables that do not have a specified value. You can of course choose to explicitly add the label to the option's data context and use that value in the label variable assignment as well.
#### Selector: wily-dropdown
#### Inputs
- value: string or number representing the value of the selected option
- options: array of `DropdownOption | DropdownOptionGroup` acting as the options to populate the dropdown
- disabled: whether the dropdown should be disabled or not
- placeholder: placeholder text to show in the dropdown when no option is selected
- ariaLabel: aria label to assign to the dropdown
- classList: CSS class list to apply to the dropdown
#### Outputs
- change: event emitted on dropdown option selection if selection has changed from the previous value, emits the selected value

## WilyEndpointStateModule
### EndpointStateComponent
The endpoint state component serves as a catch-all for displaying endpoint states (loading, not found and error).
#### Usage
The endpoint state component is split into four different possible states: loading, loadingOverlay, empty and error. You specify which state the component should be in by passing in `true` to the desired state as an input. Note: only one state should be active at a time.
#### Inputs
- loading: whether the component should be in the loading state
- loadingIcon: an icon class to display in the loading state
- loadingText: main text to display in the loading state
- loadingSubtext: subtext to display in the loading state
- loadingOverlay: whether the component should be in the loading overlay state (whole-screen overlay)
- loadingOverlayIcon: an icon class to display in the loading overlay state
- loadingOverlayText: main text to display in the loading overlay state
- loadingOverlaySubtext: subtext to display in the loading overlay state
- empty: whether the component should be in the empty (not found) state
- emptyIcon: an icon class to display in the empty state
- emptyText: main text to display in the empty state
- emptySubtext: subtext to display in the empty state
- error: whether the component should be in the error state
- errorIcon: an icon class to display in the error state
- errorText: main text to display in the error state
- errorSubtext: subtext to display in the error state

## WilyIconsModule
### IconSelectComponent
The icon select component allows a user to search for and select either a Fontawesome or Wily (custom) icon.
### Usage
The icon select accepts an icon class through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the icon select, you can listen for its `ngModelChange` event (if using `ngModel`) or its `selected` event. The value emitted from the component is the selected icon class. Model updates on confirm button click.
### Inputs
- value: setter for the internal value of the component
- disabled: whether the component is disabled
- buttonColorClass: CSS class to apply to the icon dialog show button
- buttonSizing: the size (width/height) of the icon dialog show button in pixels
#### Outputs
- opened: event emitted on icon dialog open
- selected: event emitted on icon dialog confirmation, emits selected icon in the form of `{ value: string }`
- closed: event emitted on icon dialog close

## WilyKeyfilterModule
### KeyfilterDirective
Directive to apply to HTML input elements to filter out certain input.
#### Usage
Supported filter types are `alpha` (English alphabet only), `numeric` (digits only) and `alphanumeric` (English alphabet and digits).
#### Selector: wilyKeyfilter
#### Inputs
- wilyKeyfilter: the filter type to apply to the host input
- allowSpaces: whether to allow spaces in input (default `false`)

## Usage

`npm install wily-angular-commons`

Component listing and usage coming soon.

## Build and Release Instructions

### Package

Run the following:

`npm run package`

`cd dist`

`npm pack`

`cd ..`

### Test

After packaging, you can install a local build for testing with the following:

`npm install ../wily-angular-commons/dist/wily-angular-commons-1.1.1.tgz`

### Release

`npm publish dist`

## Further Help

For more help, please reach out to `nick.dimola@gdit.com`.
