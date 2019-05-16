import {AfterViewInit, Component, forwardRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Editor} from 'primeng/editor';
import {DomHandler} from 'primeng/api';

/**
 * Accessor information for the Rich Text Editor
 */
export const RICH_TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RichTextComponent),
  multi: true
};

/**
 * Rich Text Editor that wraps a PrimeNG Editor, which in turn wraps Quill. Allows us to customize.
 */
@Component({
  selector: 'wily-rich-text',
  templateUrl: 'rich-text.component.html',
  providers: [DomHandler, RICH_TEXT_VALUE_ACCESSOR]
})
export class RichTextComponent implements ControlValueAccessor, AfterViewInit {

  /**
   * Toolbar visible?
   */
  toolbarVisible: boolean;

  /**
   * Enable hide/show of the Rich Text controls. If false, show them all the time.
   */
  @Input()
  doHideShow = true;

  /**
   * Height of the input
   */
  @Input()
  height = '100px';

  /**
   * Sets the input to readonly
   */
  @Input()
  readonly = false;

  /**
   * Placeholder text
   */
  @Input()
  placeholder = '';

  /**
   * Reference to the PrimeNG Editor
   */
  @ViewChild('editor')
  editor: Editor;

  /**
   * Allow a user to point at an image on the internet so that it's not just embedded in the text.
   */
  ngAfterViewInit(): void {
    this.editor.getQuill().getModule('toolbar').handlers.image = () => {
      const range = this.editor.getQuill().getSelection();
      const value = prompt('Please enter the image URL');
      this.editor.getQuill().insertEmbed(range.index, 'image', value, 'user');
    };

    this.applyAccessibilityHacks(this.editor.getQuill());
  }

  /**
   * Pass through function to PrimeNG Editor
   *
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.editor.registerOnChange(fn);
  }

  /**
   * Pass through function to PrimeNG Editor
   *
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.editor.registerOnTouched(fn);
  }

  /**
   * Pass through function to PrimeNG Editor
   *
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
  }

  /**
   * Write to the editor. Pass through function.
   * @param value
   */
  writeValue(value: any): void {
    this.editor.writeValue(value);
  }

  /**
   * Applies accessibility to a quill editor
   * TODO: Deprecate this method once this issue is resolved (https://github.com/quilljs/quill/issues/1173)
   * @param {object}    editor    - A Quill editor instance
   */
  applyAccessibilityHacks(editor: any): void {

    // Get ref to the toolbar, its not available through the quill api ughh
    const query = editor.container.parentElement.getElementsByClassName('ql-toolbar');
    if (query.length !== 1) {
      // No toolbars found OR multiple which is not what we expect either
      return;
    }

    const toolBar = query[0];

    // apply aria labels to base buttons
    const buttons = toolBar.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      if (!button.getAttribute('class')) {
        continue;
      }

      const className = button.getAttribute('class').toLowerCase();

      if (className.indexOf('bold') >= 0) {
        button.setAttribute('aria-label', 'Toggle bold text');
      } else if (className.indexOf('italic') >= 0) {
        button.setAttribute('aria-label', 'Toggle italic text');
      } else if (className.indexOf('underline') >= 0) {
        button.setAttribute('aria-label', 'Toggle underline text');
      } else if (className.indexOf('blockquote') >= 0) {
        button.setAttribute('aria-label', 'Toggle blockquote text');
      } else if (className.indexOf('list') >= 0 && button.value === 'ordered') {
        button.setAttribute('aria-label', 'Toggle ordered list');
      } else if (className.indexOf('list') >= 0 && button.value === 'bullet') {
        button.setAttribute('aria-label', 'Toggle bulleted list');
      }
    }

    // Make pickers work with keyboard and apply aria labels
    // TO FIX: When you open a submenu with a key and close it with a click, the menu aria-hidden val is incorrectly left to `false`
    const pickers = toolBar.getElementsByClassName('ql-picker');
    for (let i = 0; i < pickers.length; i++) {
      const picker = pickers[i];

      const label = picker.getElementsByClassName('ql-picker-label')[0];
      const optionsContainer = picker.getElementsByClassName('ql-picker-options')[0];
      const options = optionsContainer.getElementsByClassName('ql-picker-item');

      label.setAttribute('role', 'button');
      label.setAttribute('aria-haspopup', 'true');
      label.setAttribute('tabindex', '0');

      // HACK ALERT - Specifically does these labels based on our ordering
      if (i === 0) {
        label.setAttribute('aria-label', 'Font Size');
      } else if (i === 1) {
        label.setAttribute('aria-label', 'Font Color');
      } else if (i === 2) {
        label.setAttribute('aria-label', 'Background Color');
      } else if (i === 3) {
        label.setAttribute('aria-label', 'Text Alignment');
      }

      optionsContainer.setAttribute('aria-hidden', 'true');
      optionsContainer.setAttribute('aria-label', 'submenu');

      for (let x = 0; x < options.length; x++) {
        const item = options[x];
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');

        // Read the css 'content' values and generate aria labels
        const size = window.getComputedStyle(item, ':before').content.replace('\"', '');
        item.setAttribute('aria-label', size);
        item.addEventListener('keyup', (e) => {
          if (e.keyCode === 13) {
            item.click();
            optionsContainer.setAttribute('aria-hidden', 'true');
          }
        });
      }

      label.addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
          label.click();
          optionsContainer.setAttribute('aria-hidden', 'false');
        }
      });
    }
  }

}
