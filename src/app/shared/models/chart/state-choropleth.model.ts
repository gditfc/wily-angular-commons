import {Chart} from './chart.model';

/**
 * State Choropleth Data
 */
export class StateChoroplethData {

  /**
   * Map to Use
   */
  map: string;

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
  id: string;

  /**
   * Value
   */
  value: number;
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
  colorSolid: string;

  /**
   * Text Color
   */
  color: string;

  /**
   * Balloon Text Template
   */
  balloonText = 'Population in [[title]]: <b>[[value]]</b>';

  /**
   * Color on rollover
   */
  rollOverColor: string;

  /**
   * Outline for rollover
   */
  rollOverOutlineColor = '#FFFFFF';

  /**
   * Color for Selected
   */
  selectedColor: string;
}

/**
 * Choropleth Legend
 */
export class StateChoroplethValueLegend {

  /**
   * Left Margin
   */
  left: number;

  /**
   * Overall Min Value for Legend
   */
  minValue: string;

  /**
   * Overall Max Value for Legend
   */
  maxValue: string;
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
  dataProvider: StateChoroplethData;

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
  valueLegend: StateChoroplethValueLegend;

}
