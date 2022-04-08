import {AfterViewInit, Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation} from '@angular/core';
import {Editor} from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TextAlign} from './text-align';

export const RICH_TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RichTextComponent),
  multi: true
};

@Component({
  selector: 'wily-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.css'],
  providers: [RICH_TEXT_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None

})
export class RichTextComponent implements ControlValueAccessor, AfterViewInit {

  @Input()
  placeholder = '';

  @Input()
  hideControls = false;

  @Input()
  height = '100px';

  @Input()
  get readonly(): boolean {
    return this._editable;
  }

  set readonly(readonly: boolean) {
    this._editable = !readonly;
    this.editor.setEditable(this._editable);
  }

  @Output()
  textChanged = new EventEmitter<{
    htmlValue: string,
    textValue: string
  }>();

  /**
   * Function called on change
   */
  onChange: ((value: string) => void) | undefined;

  /**
   * Function called on touch
   */
  onTouched: (() => void) | undefined;

  private _value: string = null as any;
  private _editable = true;

  editor = new Editor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'wrt-link',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],

      }),
      Placeholder.configure({
        placeholder: () => this.placeholder
      })
    ],
    editorProps: {
      attributes: {
        class: '',
        spellcheck: 'true',
      },
    },
    enablePasteRules: [Link, Underline, StarterKit, TextAlign]
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

  private static formatLegacyRichText(text: string): string {
    if (text) {
      text = text.replace('class="ql-align-center"', 'style="text-align:center;"');
      text = text.replace('class="ql-align-right"', 'style="text-align:right;"');
      text = text.replace('class="ql-align-justify"', 'style="text-align:justify;"');
    }

    return text;
  }

  ngAfterViewInit(): void {
    this.editor.setEditable(this._editable);

    this.editor.on('update', ({editor}) => {
      this.textChanged.emit({
        textValue: editor.getText(),
        htmlValue: this._value
      });
    });
  }

  onBlur(): void {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  writeValue(value: string): void {
    if (value !== this._value) {
      this._value = RichTextComponent.formatLegacyRichText(value);
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
    const url = window.prompt(
      'Please provide a URL - if you\'d like to remove the link, simply delete all of the text in the box below',
      previousUrl) as string;

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
