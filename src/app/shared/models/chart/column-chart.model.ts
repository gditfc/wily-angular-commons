import {Chart} from './chart.model';

/**
 * The representation of data to populate a column of the chart
 */
export class ColumnChartData {

  /**
   * Description of the column
   */
  description: string;

  /**
   * Column value
   */
  value: number;

  /**
   * Color of the column
   */
  color: string;

  /**
   * Column order position
   */
  position: number;

  /**
   * Array of data for a stacked bar chart
   */
  data: any[];
}

/**
 * Representation of a Column Chart for AM Charts
 */
export class ColumnChart extends Chart {

  /**
   * Defaults the type to serial so that it renders a column chart.
   */
  type = 'serial';

  /**
   * Sets the margin right to 30 by default
   */
  marginRight = 30;

  /**
   * The array of data to make the stacked bar chart
   */
  dataProvider: ColumnChartData[];

  /**
   * Duration of the render animation
   */
  startDuration = 1;

  /**
   * Lets AMCharts know that the category for the column can be found in the
   * [ColumnChartData.description]{@link ColumnChartData#description}
   */
  categoryField = 'description';

  /**
   * Sets some general information for the chart
   */
  graphs = [{
    balloonText: '<b>[[description]]: [[value]]</b>',
    fillColorsField: 'color',
    fillAlphas: 0.9,
    lineAlpha: 0.2,
    type: 'column',
    valueField: 'value'
  }];

  /**
   * Sets the axis data
   */
  categoryAxis = {
    gridPosition: 'start',
    labelRotation: 45
  };

  /**
   * Sets the cursor data
   */
  chartCursor = {
    categoryBalloonEnabled: false,
    cursorAlpha: 0,
    zoomable: false
  };

  /**
   * Sets the value axes data
   */
  valueAxes = [{
    axisAlpha: 0,
    position: 'left',
    title: ''
  }];

  /**
   * Sets the listener to the clickGraphItem event
   */
  listeners = [{
    event: 'clickGraphItem',
    method: null
  }];

  /**
   * Function to set the Y Axis Title
   *
   * @param title
   */
  setYAxisTitle(title: string) {
    this.valueAxes[0].title = title;
  }

  /**
   * Pass in a function so that it's called on click
   *
   * @param func
   */
  setClickListener(func: any) {
    this.listeners[0].method = func;
  }
}
