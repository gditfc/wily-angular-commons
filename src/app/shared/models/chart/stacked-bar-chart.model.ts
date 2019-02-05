import {Chart} from './chart.model';

export class StackedBarChartData {
  category: string;
  value0 = 0;
  value1 = 0;
  value2 = 0;
  value3 = 0;
  value4 = 0;
  value5 = 0;
  value6 = 0;
  value7 = 0;
  value8 = 0;
  value9 = 0;
  value10 = 0;
  value11 = 0;
  value12 = 0;
  value13 = 0;
  value14 = 0;
  value15 = 0;
  value16 = 0;
  value17 = 0;
  value18 = 0;
  value19 = 0;
}

export class StackedBarChartGraph {
  balloonText = '<b>[[category]]</b><br><span style="font-size:14px">[[title]]: <b>[[value]]</b></span>';
  fillAlphas = 0.8;
  labelText = '[[value]]';
  lineAlpha = 0.3;
  type = 'column';
  color = '#FFFFFF';
  columnWidth = .5;

  title: string;
  valueField: string;
  fillColors: string;
  lineColor: string;

  setColor(color: string) {
    this.fillColors = color;
    this.lineColor = color;
  }
}

export class StackedBarChart extends Chart {
  type = 'serial';
  dataProvider: StackedBarChartData[];
  graphs: StackedBarChartGraph[];
  rotate = true;
  categoryField = 'category';
  startDuration = 1;

  legend = {
    horizontalGap: 10,
    maxColumns: 1,
    position: 'right',
    useGraphSettings: true,
    markerSize: 10
  };

  valueAxes = [{
    stackType: 'regular',
    axisAlpha: 0.5,
    gridAlpha: 0
  }];

  categoryAxis = {
    gridPosition: 'start',
    axisAlpha: 0,
    gridAlpha: 0,
    position: 'left'
  };

}
