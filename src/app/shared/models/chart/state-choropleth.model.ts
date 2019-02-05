import {Chart} from './chart.model';

export class StateChoroplethData {
  map: string;
  getAreasFromMap = true;
  zoomLevel = 0.95;
  areas: StateChoroplethAreaStatistic[] = [];
  images = [];
}

export class StateChoroplethAreaStatistic {
  id: string;
  value: number;
}

export class StateChoroplethAreaSettings {
  autoZoom = false;
  selectable = true;
  colorSolid: string;
  color: string;
  balloonText = 'Population in [[title]]: <b>[[value]]</b>';
  rollOverColor: string;
  rollOverOutlineColor = '#FFFFFF';
  selectedColor: string;
}

export class StateChoroplethValueLegend {
  left: number;
  minValue: string;
  maxValue: string;
}

export class StateChoropleth extends Chart {
  type = 'map';
  colorSteps = 10;
  useHandCursorOnClickableOjects = true;
  dataProvider: StateChoroplethData;
  areasSettings: StateChoroplethAreaSettings = new StateChoroplethAreaSettings();

  imagesSettings = {
    labelColor: '#ccc',
    mouseEnabled: false
  };

  zoomControl = {
    minZoomLevel: 0.8
  };

  valueLegend: StateChoroplethValueLegend;

}
