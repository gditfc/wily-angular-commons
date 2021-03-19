import { Component, forwardRef, OnInit, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Component that wraps the native HTML5 color picker for supported browsers
 */
@Component({
  selector: 'wily-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})
export class ColorPickerComponent implements OnInit {

  /**
   * Whether or not to render the component
   */
  render: boolean;

  /**
   * Whether or not the native HTML5 color picker is supported
   */
  colorPickerSupported: boolean;

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   */
  constructor(private renderer: Renderer2) { }

  /**
   * Init component, check for color picker browser support
   */
  ngOnInit(): void {
    this.colorPickerSupported = this.isColorPickerSupported();
    this.render = true;
  }

  /**
   * Determine if the browser supports the HTML5 color picker
   * @private
   */
  private isColorPickerSupported(): boolean {
    let colorPickerSupported = false;

    try {
      const inputElement: HTMLInputElement = this.renderer.createElement('input');
      inputElement.type = 'color';
      inputElement.value = '!';

      colorPickerSupported = inputElement.type === 'color' && inputElement.value !== '!';
    } catch (e) { }

    return colorPickerSupported;
  }
}
