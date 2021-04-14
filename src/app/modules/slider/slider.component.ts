import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

/**
 * Component that wraps the native HTML5 slider
 */
@Component({
  selector: 'wily-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {

  /**
   * Set the minimum slider value
   * @param min the value to set
   */
  @Input()
  set min(min: number) {
    this._min = isNaN(min) ? 0 : min;
  }

  /**
   * Set the maximum slider value
   * @param max the value to set
   */
  @Input()
  set max(max: number) {
    this._max = isNaN(max) ? 100 : max;
  }

  /**
   * Set the slider step size
   * @param step the value to set
   */
  @Input()
  set step(step: number) {
    this._step = isNaN(step) ? 1 : step;
  }

  /**
   * The unit being represented by the slider
   */
  @Input()
  unit: string;

  /**
   * The aria-label to append to the slider/input
   */
  @Input()
  ariaLabel: string;

  /**
   * The minimum slider value
   */
  _min: number;

  /**
   * The maximum slider value
   */
  _max: number;

  /**
   * The step size of the slider
   */
  _step: number;

  /**
   * Dependency injection site
   * @param changeDetectorRef the Angular ChangeDetectorRef
   */
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  /**
   * Init component
   */
  ngOnInit(): void { }
}
