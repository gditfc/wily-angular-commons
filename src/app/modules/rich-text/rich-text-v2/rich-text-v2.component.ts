import {Component, forwardRef, ViewEncapsulation} from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export const RICH_TEXT2_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RichTextV2Component),
  multi: true
};

@Component({
  selector: 'wily-rich-text-v2',
  templateUrl: './rich-text-v2.component.html',
  styleUrls: ['./rich-text-v2.component.css'],
  providers: [RICH_TEXT2_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None

})
export class RichTextV2Component implements ControlValueAccessor {

  /**
   * Function called on change
   */
  onChange: (value: string) => void;

  /**
   * Function called on touch
   */
  onTouched: () => void;

  private _value: string;

  editor = new Editor({
    extensions: [StarterKit]
  });

  get value(): any {
    return this._value;
  }

  set value(value: string) {
    // TODO: Remove this - it does fix the onload issue that wipes the value supplied, but feels... wrong.
    if (value === '<p></p>') {
      return;
    }

    if (value !== this._value) {
      this._value = value;
      this.onChange(value);
    }
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: string) {
    if (value !== this._value) {
      this._value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.editor.setEditable(isDisabled);
  }

}
