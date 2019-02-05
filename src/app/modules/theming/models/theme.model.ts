export class Theme {

  themeId = 0;
  name = 'Default';
  headerColor = '#628396';
  menuColor = '#628396';
  navColor = '#628396';
  footerColor = '#777777';
  containerColor = '#FEFEFE';
  mainBgColor = '#CCCCCC';
  bgColor1 = '#3392B9';
  bgColor2 = '#894870';
  bgColor3 = '#B7B933';
  bgColor4 = '#871A41';
  bgColor5 = '#468459';
  borderColor = '#A8A8A8';
  fontColor1 = '#FFFFFF';
  fontColor2 = '#585858';
  ok = '#05abe0';
  go = '#4bb642';
  cancel = '#888888';
  alert = '#c01616';
  progress = '#9e9c7a';
  info = '#7e5966';
  warning = '#a97c2e';

  constructor(theme?: Theme) {
    if (theme) {
      if (theme.themeId) {
        this.themeId = theme.themeId;
      }

      if (theme.name) {
        this.name = theme.name;
      }

      if (theme.headerColor) {
        this.headerColor = theme.headerColor;
      }

      if (theme.bgColor1) {
        this.bgColor1 = theme.bgColor1;
      }

      if (theme.bgColor2) {
        this.bgColor2 = theme.bgColor2;
      }

      if (theme.bgColor3) {
        this.bgColor3 = theme.bgColor3;
      }

      if (theme.bgColor4) {
        this.bgColor4 = theme.bgColor4;
      }

      if (theme.bgColor5) {
        this.bgColor5 = theme.bgColor5;
      }

      if (theme.menuColor) {
        this.menuColor = theme.menuColor;
      }

      if (theme.navColor) {
        this.navColor = theme.navColor;
      }

      if (theme.footerColor) {
        this.footerColor = theme.footerColor;
      }

      if (theme.containerColor) {
        this.containerColor = theme.containerColor;
      }

      if (theme.mainBgColor) {
        this.mainBgColor = theme.mainBgColor;
      }

      if (theme.borderColor) {
        this.borderColor = theme.borderColor;
      }

      if (theme.fontColor1) {
        this.fontColor1 = theme.fontColor1;
      }

      if (theme.fontColor2) {
        this.fontColor2 = theme.fontColor2;
      }

      if (theme.ok) {
        this.ok = theme.ok;
      }
      if (theme.go) {
        this.go = theme.go;
      }
      if (theme.cancel) {
        this.cancel = theme.cancel;
      }
      if (theme.alert) {
        this.alert = theme.alert;
      }
      if (theme.progress) {
        this.progress = theme.progress;
      }
      if (theme.info) {
        this.info = theme.info;
      }
      if (theme.warning) {
        this.warning = theme.warning;
      }
    }
  }

  equals(theme: any): boolean {
    if (!theme) {
      return false;
    }

    return this.containerColor === theme.containerColor &&
      this.bgColor1 === theme.bgColor1 &&
      this.bgColor2 === theme.bgColor2 &&
      this.bgColor3 === theme.bgColor3 &&
      this.bgColor4 === theme.bgColor4 &&
      this.bgColor5 === theme.bgColor5 &&
      this.menuColor === theme.menuColor &&
      this.navColor === theme.navColor &&
      this.footerColor === theme.footerColor &&
      this.mainBgColor === theme.mainBgColor &&
      this.containerColor === theme.containerColor &&
      this.borderColor === theme.borderColor &&
      this.fontColor1 === theme.fontColor1 &&
      this.fontColor2 === theme.fontColor2 &&
      this.ok === theme.ok &&
      this.go === theme.go &&
      this.cancel === theme.cancel &&
      this.alert === theme.alert &&
      this.progress === theme.progress &&
      this.info === theme.info &&
      this.warning === theme.warning;
  }
}
