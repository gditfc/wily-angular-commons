import {Chart} from './chart.model';

/**
 * Information for the Axis of a Gantt
 */
export class GanttValueAxis {

  /**
   * Defaults the type to date
   */
  type = 'date';
}

/**
 * Information about the Balloon Text for the Gantt Chart
 */
export class GanttGraph {

  /**
   * Sets the fill to be no opacity
   */
  fillAlphas = 1;

  /**
   * Defaults the template for the balloon text
   */
  balloonText = '<b>[[task]]</b>: [[start]] to [[end]]';
}

/**
 * The segment data for a piece of the Gantt chart
 */
export class GanttSegment {

  /**
   * The color
   */
  color: string;

  /**
   * The categorization
   */
  task: string;

  /**
   * The start date
   */
  start: string;

  /**
   * The label associated with the start date
   */
  startLabel: string;

  /**
   * The end date
   */
  end: string;

  /**
   * The label associated with the end date
   */
  endLabel: string;
}

/**
 * A Data Provider for the Gantt Chart
 */
export class GanttDataProvider {

  /**
   * The category of this data segment
   */
  category: string;

  /**
   * The data segments for this entry of the Gantt chart
   */
  segments: GanttSegment[] = [];
}

/**
 * Gantt scroll bar configuration
 */
export class GanttValueScrollbar {

  /**
   * Auto-label the grid with a count
   */
  autoGridCount = true;
}

/**
 * Defaulted data for the Gantt Chart Cursor
 */
export class GanttChartCursor {

  /**
   * Color
   */
  cursorColor = '#55bb76';

  /**
   * Are value balloons enabled?
   */
  valueBalloonsEnabled = false;

  /**
   * Cursor alpha
   */
  cursorAlpha = 0;

  /**
   * Value line alpha
   */
  valueLineAlpha = 0.5;

  /**
   * Balloons enabled?
   */
  valueLineBalloonEnabled = true;

  /**
   * Value lines enabled?
   */
  valueLineEnabled = true;

  /**
   * Chart zoomable?
   */
  zoomable = false;

  /**
   * Value zoomable?
   */
  valueZoomable = true;
}

/**
 * Representation of a Gantt Chart
 */
export class GanttChart extends Chart {

  /**
   * Chart type
   */
  type = 'gantt';

  /**
   * Right Margin
   */
  marginRight = 30;

  /**
   * Time period for the Gantt
   */
  period = 'MM';

  /**
   * Date Format
   */
  dataDateFormat = 'YYYY-MM-DD';

  /**
   * Balloon Date Format
   */
  balloonDateFormat = 'JJ:NN';

  /**
   * Column width
   */
  columnWidth = 0.5;

  /**
   * Value axis
   */
  valueAxis: GanttValueAxis = new GanttValueAxis();

  /**
   * Brightness
   */
  brightnessStep = 10;

  /**
   * Graph data
   */
  graph: GanttGraph = new GanttGraph();

  /**
   * Rotate
   */
  rotate = true;

  /**
   * Category Field
   */
  categoryField = 'category';

  /**
   * Segments Field
   */
  segmentsField = 'segments';

  /**
   * Color Field
   */
  colorField = 'color';

  /**
   * Start Date for overall graph
   */
  startDate: string;

  /**
   * End Date for overall graph
   */
  endDate: string;

  /**
   * Start Date Field
   */
  startDateField = 'start';

  /**
   * End Date Field
   */
  endDateField = 'end';

  /**
   * Duration
   */
  durationField = 'duration';

  /**
   * The data for the graph
   */
  dataProvider: GanttDataProvider[] = [];

  /**
   * Defaulted scrollbar data
   */
  valueScrollbar: GanttValueScrollbar = new GanttValueScrollbar();

  /**
   * Defaulted cursor data
   */
  chartCursor: GanttChartCursor = new GanttChartCursor();
}
