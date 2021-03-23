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
