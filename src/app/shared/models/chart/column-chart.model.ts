import {Chart} from './chart.model';

export class ColumnChartData {
  description: string;
  value: number;
  color: string;
  position: number;
  data: any[];
}

export class ColumnChart extends Chart {
  type = 'serial';
  marginRight = 30;
  dataProvider: ColumnChartData[];
  startDuration = 1;
  categoryField = 'description';

  graphs = [{
    balloonText: '<b>[[description]]: [[value]]</b>',
    fillColorsField: 'color',
    fillAlphas: 0.9,
    lineAlpha: 0.2,
    type: 'column',
    valueField: 'value'
  }];

  categoryAxis = {
    gridPosition: 'start',
    labelRotation: 45
  };

  chartCursor = {
    categoryBalloonEnabled: false,
    cursorAlpha: 0,
    zoomable: false
  };

  valueAxes = [{
    axisAlpha: 0,
    position: 'left',
    title: ''
  }];

  listeners = [{
    event: 'clickGraphItem',
    method: null
  }];

  setYAxisTitle(title: string) {
    this.valueAxes[0].title = title;
  }

  setClickListener(func: any) {
    this.listeners[0].method = func;
  }
}
