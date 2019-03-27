import {Versioning} from '../../../shared/models/versioning.model';

export class Theme extends Versioning {

  themeId = 0;
  isDefault: string;
  name = 'Default';
  menuColor = '#628396';
  navColor = '#628396';
  footerColor = '#777777';
  bodyColor = '#CCCCCC';
  pageContainerColor = '#FEFEFE';
  dialogHeaderColor = '#708090';
  dialogBodyColor = '#FEFEFE';
  pushContainerColor = '#FEFEFE';
  overlayStyle = 'border:1px solid #DEDEDE;background-color:#EFEFEF;color:#222222;';
  overlayStyleAlt1 = 'border:1px solid #DEDEDE;background-color:#FFFFFF;color: #222222;';
  overlayStyleAlt2 = '';
  bgRed = '#871A41';
  bgRedAlt = '#c01616';
  bgOrange = '#a97c2e';
  bgOrangeAlt = '#d8a237';
  bgYellow = '#B7B933';
  bgYellowAlt = '#c7b720';
  bgGreen = '#468459';
  bgGreenAlt = '#4bb642';
  bgBlue = '#3392B9';
  bgBlueAlt = '#05abe0';
  bgPurple = '#894870';
  bgPurpleAlt = '#7e5966';
  bgBrown = '#67523f';
  bgBrownAlt = '#9e9c7a';
  bgGrey = '#888888';
  bgGreyAlt = '#A8A8A8';
  backgroundImages = 'Y';

  constructor(theme?: Theme) {
    super();

    if (theme) {
      for (const prop of Object.keys(theme)) {
        this[prop] = theme[prop];
      }
    }
  }

  getClasses(): string[] {
    const classes = [];
    for (const prop of Object.keys(this)) {
      if (prop.toLowerCase().includes('bg') || prop.toLowerCase().includes('color')) {
        classes.push(prop.split(/(?=[A-Z])/).join('_').toLowerCase());
      }
    }

    return classes;
  }
}
