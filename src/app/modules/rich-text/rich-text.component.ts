import {AfterViewInit, Component, forwardRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Editor} from 'primeng/editor';
import {DomHandler} from 'primeng/api';

export const RICH_TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RichTextComponent),
  multi: true
};

@Component({
  selector: 'wily-rich-text',
  templateUrl: 'rich-text.component.html',
  providers: [DomHandler, RICH_TEXT_VALUE_ACCESSOR]
})
export class RichTextComponent implements ControlValueAccessor, AfterViewInit {

  toolbarVisible: boolean;

  @Input()
  doHideShow = true;

  @Input()
  height = '100px';

  @ViewChild('editor')
  editor: Editor;

  ngAfterViewInit(): void {
    this.editor.getQuill().getModule('toolbar').handlers.image = () => {
      const range = this.editor.getQuill().getSelection();
      const value = prompt('Please enter the image URL');
      this.editor.getQuill().insertEmbed(range.index, 'image', value, 'user');
    };
  }

  registerOnChange(fn: any): void {
    this.editor.registerOnChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.editor.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(value: any): void {
    this.editor.writeValue(value);
  }

}
