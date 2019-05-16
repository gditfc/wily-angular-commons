import {Chart} from './chart.model';

/**
 * Data for the Stacked Bar Chart
 */
export class StackedBarChartData {

  /**
   * Label
   */
  category: string;

  /**
   * Stack Value 1 for Bar
   */
  value0 = 0;

  /**
   * Stack Value 2 for Bar
   */
  value1 = 0;

  /**
   * Stack Value 3 for Bar
   */
  value2 = 0;

  /**
   * Stack Value 4 for Bar
   */
  value3 = 0;

  /**
   * Stack Value 5 for Bar
   */
  value4 = 0;

  /**
   * Stack Value 6 for Bar
   */
  value5 = 0;

  /**
   * Stack Value 7 for Bar
   */
  value6 = 0;

  /**
   * Stack Value 8 for Bar
   */
  value7 = 0;

  /**
   * Stack Value 9 for Bar
   */
  value8 = 0;

  /**
   * Stack Value 10 for Bar
   */
  value9 = 0;

  /**
   * Stack Value 11 for Bar
   */
  value10 = 0;

  /**
   * Stack Value 12 for Bar
   */
  value11 = 0;

  /**
   * Stack Value 13 for Bar
   */
  value12 = 0;

  /**
   * Stack Value 14 for Bar
   */
  value13 = 0;

  /**
   * Stack Value 15 for Bar
   */
  value14 = 0;

  /**
   * Stack Value 16 for Bar
   */
  value15 = 0;

  /**
   * Stack Value 17 for Bar
   */
  value16 = 0;

  /**
   * Stack Value 18 for Bar
   */
  value17 = 0;

  /**
   * Stack Value 19 for Bar
   */
  value18 = 0;

  /**
   * Stack Value 20 for Bar
   */
  value19 = 0;
}

/**
 * Visual Representation Data for the Stacked Bar Chart
 */
export class StackedBarChartGraph {

  /**
   * Balloon Text Template
   */
  balloonText = '<b>[[category]]</b><br><span style="font-size:14px">[[title]]: <b>[[value]]</b></span>';

  /**
   * Fill alpha - slight opacity
   */
  fillAlphas = 0.8;

  /**
   * Label Text Template
   */
  labelText = '[[value]]';

  /**
   * Outline opacity
   */
  lineAlpha = 0.3;

  /**
   * Type
   */
  type = 'column';

  /**
   * Default color - White
   */
  color = '#FFFFFF';

  /**
   * Column Width - Default 50%
   */
  columnWidth = .5;

  /**
   * Title
   */
  title: string;

  /**
   * Value Field
   */
  valueField: string;

  /**
   * Fill Colors
   */
  fillColors: string;

  /**
   * Line Color
   */
  lineColor: string;

  /**
   * Helper Method to set the fill and line color
   *
   * @param color
   */
  setColor(color: string) {
    this.fillColors = color;
    this.lineColor = color;
  }
}

/**
 * Representation of a Stacked Bar Chart for AMCharts
 */
export class StackedBarChart extends Chart {

  /**
   * Type is serial
   */
  type = 'serial';

  /**
   * Data for the Stacked Bar Chart
   */
  dataProvider: StackedBarChartData[];

  /**
   * Visual Representation details for chart
   */
  graphs: StackedBarChartGraph[];

  /**
   * Turn the chart
   */
  rotate = true;

  /**
   * Category Field
   */
  categoryField = 'category';

  /**
   * Animation duration of 1s
   */
  startDuration = 1;

  /**
   * Legend setup
   */
  legend = {
    horizontalGap: 10,
    maxColumns: 1,
    position: 'right',
    useGraphSettings: true,
    markerSize: 10
  };

  /**
   * Value Axes Setup
   */
  valueAxes = [{
    stackType: 'regular',
    axisAlpha: 0.5,
    gridAlpha: 0
  }];

  /**
   * Category Axis setup
   */
  categoryAxis = {
    gridPosition: 'start',
    axisAlpha: 0,
    gridAlpha: 0,
    position: 'left'
  };

}
