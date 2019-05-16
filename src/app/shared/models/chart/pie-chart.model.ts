import {Chart} from './chart.model';

/**
 * Model for a Pie Chart Legend
 */
export class PieChartLegend {

  /**
   * Position of the legend
   */
  position = 'right';

  /**
   * Margin Right in pixels
   */
  marginRight = 100;

  /**
   * Auto-Margin
   */
  autoMargins = false;

  /**
   * Value Text template
   */
  valueText = '[[value]]';
}

/**
 * Pie Chart Filter for visual representation
 */
export class PieChartFilter {

  /**
   * id
   */
  id = 'shadow';

  /**
   * Width
   */
  width = '200%';

  /**
   * Height
   */
  height = '200%';

  /**
   * Offset setup
   */
  feOffset: any = {
    'result': 'offOut',
    'in': 'SourceAlpha',
    'dx': 0,
    'dy': 0
  };

  /**
   * Blur setup
   */
  feGaussianBlur: any = {
    'result': 'blurOut',
    'in': 'offOut',
    'stdDeviation': 5
  };

  /**
   * Blend setup
   */
  feBlend: any = {
    'in': 'SourceGraphic',
    'in2': 'blurOut',
    'mode': 'normal'
  };
}

/**
 * Sets up the Filter
 */
export class PieChartDefs {

  /**
   * List of filters
   */
  filter: PieChartFilter[] = [new PieChartFilter()];
}

/**
 * Representation of a slice of the PieChart
 */
export class PieChartData {

  /**
   * Description of data
   */
  description: string;

  /**
   * Data value
   */
  value: number;
}

/**
 * Representation of a PieChart in AMCharts
 */
export class PieChart extends Chart {

  /**
   * Default type to pie
   */
  type = 'pie';

  /**
   * Labels Disabled
   */
  labelsEnabled = false;

  /**
   * Animation duration is 0, won't animate in
   */
  startDuration = 0;

  /**
   * Add Class Names
   */
  addClassNames = true;

  /**
   * Enable the legend
   */
  legend: PieChartLegend = new PieChartLegend();

  /**
   * Inner Radius is zero so it's a full pie not a donut chart
   */
  innerRadius = '0%';

  /**
   * Label Radius
   */
  labelRadius: number = null;

  /**
   * Init the Defs/Filter
   */
  defs: PieChartDefs = new PieChartDefs();

  /**
   * Lets AMCharts know that the value for the pie slices can be found in the
   * [PieChartData.value]{@link PieChartData#value}
   */
  valueField = 'value';

  /**
   * Lets AMCharts know that the description for the pie slices can be found in the
   * [PieChartData.description]{@link PieChartData#description}
   */
  titleField = 'description';

  /**
   * Initializes the data to an empty array
   */
  dataProvider: PieChartData[] = [];

  /**
   * Label template
   */
  labelText = '[[title]]';

  /**
   * No auto margins
   */
  autoMargins = false;

  /**
   * Margin Top is 0
   */
  marginTop = 0;

  /**
   * Margin Bottom is 0
   */
  marginBottom = 0;

  /**
   * Margin Left is 0
   */
  marginLeft = 0;

  /**
   * Margin Right is 0
   */
  marginRight = 0;

  /**
   * Don't Pull Out
   */
  pullOutRadius: number;

  /**
   * An array of colors for the pie slices to use in order of appearance
   */
  colors: string[];
}
