# Wily Angular Commons

This package offers a small selection of reusable components that interoperate with the rest of GDIT's Wily offering. If you're interested in contributing or find any bugs, feel free to catch us on GitHub.

## WilyColorPickerModule
### ColorPickerComponent
The color picker component is a simple way to choose/input a color in hexadecimal format. It offers a text input that allows for free entry in hexadecimal format along with a color picker for supported browsers. If the browser does not support the HTML5 color picker, it is replaced with a simple color swatch that acts as a preview of the contents of the text input.
#### Usage
The color picker accepts a hexadecimal color string (either in short or full form, leading `#` optional, case is ignored) through either its `value` input or through one/two-way data-binding via `ngModel`. To read in the value of the color picker, you can listen for its `ngModelChange` event (if using one-way data-binding) or its `colorSelected` event. The value emitted from the component is a full hexadecimal color string (ex: #0a50d3). Model updates on every color picker input, every valid text input entry and when the contents of the text input are deleted by the user.
#### Selector: wily-color-picker
#### Inputs
- value: setter for the internal value of the component
- disabled: whether the component should be disabled
- ariaLabel: the aria label to set for the color picker/text input
- classList: CSS class list to apply to the text input
#### Outputs
- input: event emitted on text input, emits the current value of the component
- colorSelected: event emitted on color picker close or on valid hexadecimal string input from the text input, emits the selected color as a hexadecimal string

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
