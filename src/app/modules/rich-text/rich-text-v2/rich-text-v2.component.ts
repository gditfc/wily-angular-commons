import {Component, forwardRef, ViewEncapsulation} from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

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
  onChange: ((value: string) => void) | undefined;

  /**
   * Function called on touch
   */
  onTouched: (() => void) | undefined;

  private _value: string = null as any;

  editor = new Editor({
    extensions: [
      StarterKit,
      Link,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        class: '',
        spellcheck: 'true',
      },
    },
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
      if (this.onChange) {
        this.onChange(value);
      }
    }
  }

  onBlur() {
    if (this.onTouched) {
      this.onTouched();
    }
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

  setLink(): void {
    const previousUrl = this.editor.getAttributes('link').href;
    let url = '';

    if (!this.editor.isActive('link')) {
      url = window.prompt('URL', previousUrl) as string;
    }

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      this.editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }
}
