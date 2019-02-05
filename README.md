# Wily Angular Commons

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.0.

## Package the module

Run the following:

`npm run package`

`cd dist`

`npm pack`

`cd ..`

(Optional) To experiment using 'wily-angular-commons' components/services before publishing, run the below under the target angular app root folder (pointing to the locally wily commons build tar ball version) 
*Our observation is that npm cache is not cleared easily, so its easier to keep upgrading local versions for testing before final release*
npm install ../wily-angular-commons/dist/wily-angular-commons-1.1.1.tgz

`npm publish dist`

## Further help


To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
