import {Chart} from './chart.model';

export class PieChartLegend {
  position = 'right';
  marginRight = 100;
  autoMargins = false;
  valueText = '[[value]]';
}

export class PieChartFilter {
  id = 'shadow';
  width = '200%';
  height = '200%';
  feOffset: any = {
    'result': 'offOut',
    'in': 'SourceAlpha',
    'dx': 0,
    'dy': 0
  };

  feGaussianBlur: any = {
    'result': 'blurOut',
    'in': 'offOut',
    'stdDeviation': 5
  };

  feBlend: any = {
    'in': 'SourceGraphic',
    'in2': 'blurOut',
    'mode': 'normal'
  };
}

export class PieChartDefs {
  filter: PieChartFilter[] = [];

  constructor() {
    this.filter.push(new PieChartFilter());
  }
}


export class PieChartData {
  description: string;
  value: number;
}

export class PieChart extends Chart {
  type = 'pie';
  labelsEnabled = false;
  startDuration = 0;
  addClassNames = true;
  legend: PieChartLegend = new PieChartLegend();
  innerRadius = '0%';
  labelRadius: number = null;
  defs: PieChartDefs = new PieChartDefs();
  valueField = 'value';
  titleField = 'description';
  dataProvider: PieChartData[] = [];
  labelText = '[[title]]';

  autoMargins = false;
  marginTop = 0;
  marginBottom = 0;
  marginLeft = 0;
  marginRight = 0;
  pullOutRadius: number;

  colors: string[];
}
