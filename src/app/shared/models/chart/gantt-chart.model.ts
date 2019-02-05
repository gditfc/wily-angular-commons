import {Chart} from './chart.model';

export class GanttValueAxis {
  type = 'date';
}

export class GanttGraph {
  fillAlphas = 1;
  balloonText = '<b>[[task]]</b>: [[start]] to [[end]]';
}

export class GanttSegment {
  color: string;
  task: string;
  start: string;
  startLabel: string;
  end: string;
  endLabel: string;
}

export class GanttDataProvider {
  category: string;
  segments: GanttSegment[] = [];
}

export class GanttValueScrollbar {
  autoGridCount = true;
}

export class GanttChartCursor {
  cursorColor = '#55bb76';
  valueBalloonsEnabled = false;
  cursorAlpha = 0;
  valueLineAlpha = 0.5;
  valueLineBalloonEnabled = true;
  valueLineEnabled = true;
  zoomable = false;
  valueZoomable = true;
}

export class GanttChart extends Chart {
  type = 'gantt';
  marginRight = 30;
  period = 'MM';
  dataDateFormat = 'YYYY-MM-DD';
  balloonDateFormat = 'JJ:NN';
  columnWidth = 0.5;
  valueAxis: GanttValueAxis = new GanttValueAxis();
  brightnessStep = 10;
  graph: GanttGraph = new GanttGraph();
  rotate = true;
  categoryField = 'category';
  segmentsField = 'segments';
  colorField = 'color';
  startDate: string;
  endDate: string;
  startDateField = 'start';
  endDateField = 'end';
  durationField = 'duration';
  dataProvider: GanttDataProvider[] = [];
  valueScrollbar: GanttValueScrollbar = new GanttValueScrollbar();
  chartCursor: GanttChartCursor = new GanttChartCursor();
}
