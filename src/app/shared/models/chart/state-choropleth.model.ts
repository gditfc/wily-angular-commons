import {Chart} from './chart.model';

/**
 * State Choropleth Data
 */
export class StateChoroplethData {

  /**
   * Map to Use
   */
  map: string = null as any;

  /**
   * Pull area from map
   */
  getAreasFromMap = true;

  /**
   * 95% Zoom
   */
  zoomLevel = 0.95;

  /**
   * Bissect the map with this data
   */
  areas: StateChoroplethAreaStatistic[] = [];

  /**
   * Images to use
   */
  images = [];
}

/**
 * Individual Data points for map
 */
export class StateChoroplethAreaStatistic {

  /**
   * ID
   */
  id: string = null as any;

  /**
   * Value
   */
  value: number = null as any;
}

/**
 * Map Visual Settings
 */
export class StateChoroplethAreaSettings {

  /**
   * Disable Auto Zoom
   */
  autoZoom = false;

  /**
   * Allow Map interaction
   */
  selectable = true;

  /**
   * Solid Color
   */
  colorSolid: string = null as any;

  /**
   * Text Color
   */
  color: string = null as any;

  /**
   * Balloon Text Template
   */
  balloonText = 'Population in [[title]]: <b>[[value]]</b>';

  /**
   * Color on rollover
   */
  rollOverColor: string = null as any;

  /**
   * Outline for rollover
   */
  rollOverOutlineColor = '#FFFFFF';

  /**
   * Color for Selected
   */
  selectedColor: string = null as any;
}

/**
 * Choropleth Legend
 */
export class StateChoroplethValueLegend {

  /**
   * Left Margin
   */
  left: number = null as any;

  /**
   * Overall Min Value for Legend
   */
  minValue: string = null as any;

  /**
   * Overall Max Value for Legend
   */
  maxValue: string = null as any;
}

/**
 * StateChoropleth representation for AMMaps
 */
export class StateChoropleth extends Chart {

  /**
   * Map Type
   */
  type = 'map';

  /**
   * 10 color steps for shading
   */
  colorSteps = 10;

  /**
   * Uses the pointer when things are clickable
   */
  useHandCursorOnClickableOjects = true;

  /**
   * The data for the map
   */
  dataProvider: StateChoroplethData = null as any;

  /**
   * Area Settings for the map for colors, outlines, labels, etc
   */
  areasSettings: StateChoroplethAreaSettings = new StateChoroplethAreaSettings();

  /**
   * Image Settings
   */
  imagesSettings = {
    labelColor: '#ccc',
    mouseEnabled: false
  };

  /**
   * Zoom settings
   */
  zoomControl = {
    minZoomLevel: 0.8
  };

  /**
   * Set this to enable the legend, off by default
   */
  valueLegend: StateChoroplethValueLegend = null as any;

}
