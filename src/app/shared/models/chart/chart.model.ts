/**
 * General AM Charts Model
 */
export class Chart {

  /**
   * Hides the AMCharts logo
   */
  hideCredits = true;

  /**
   * Defaults to the font to Montserrat to match Wily Styles
   */
  fontFamily = 'Montserrat, sans-serif';

  /**
   * Baselines the font size to a standard 14pt
   */
  fontSize = 14;

  /**
   * Light theme default
   */
  theme = 'light';

  /**
   * Allows for export of chart data
   */
  export: any = {
    enabled: true
  };

  /**
   * Defaults the chart to be repsonsive
   */
  responsive: any = {
    enabled: true
  };

}
