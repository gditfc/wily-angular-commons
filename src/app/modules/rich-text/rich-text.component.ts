import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef, HostListener,
  Input, OnDestroy,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import * as Quill from 'quill';

/**
 * Accessor information for the Rich Text Editor
 */
export const RICH_TEXT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RichTextComponent),
  multi: true
};

/**
 * Rich Text Editor that wraps Quill. Allows us to customize.
 * TODO: Remove formatting on paste (preserve new-lines)
 */
@Component({
  selector: 'wily-rich-text',
  templateUrl: 'rich-text.component.html',
  styleUrls: ['./rich-text.component.css'],
  providers: [RICH_TEXT_VALUE_ACCESSOR]
})
export class RichTextComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {

  /**
   * ViewChild of the editor div
   */
  @ViewChild('editor')
  editor: ElementRef<HTMLDivElement>;

  /**
   * ViewChild of the editor toolbar div
   */
  @ViewChild('toolbar')
  toolbar: ElementRef<HTMLDivElement>;

  /**
   * Set value
   * @param value the value to set
   */
  @Input('value')
  set value(value: string) {
    this._value = value;
  }

  /**
   * Get value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Enable hide/show of the Rich Text controls. If false, show them all the time.
   */
  @Input()
  doHideShow = false;

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
   * Event emitted on editor text change
   */
  @Output()
  textChanged = new EventEmitter<{
    htmlValue: string,
    textValue: string,
    delta: any,
    source: any
  }>();

  /**
   * Event emitted on selection change
   */
  @Output()
  selectionChanged = new EventEmitter<any>();

  /**
   * Event emitted when the editor has initialized. Emits the underlying quill instance
   */
  @Output()
  init = new EventEmitter<any>();

  /**
   * Toolbar visible?
   */
  toolbarVisible: boolean;

  /**
   * Whether or not the editor has focus
   */
  editorFocused = false;

  /**
   * The value of the editor
   * @private
   */
  private _value: string;

  /**
   * Reference to the underlying Quill instance
   * @private
   */
  private quill: any;

  /**
   * Array of keyup event unlisten functions
   * @private
   */
  private keyupUnlisteners: Array<() => void> = [];

  /**
   * Function called on change
   */
  onChange: (value: string) => void;

  /**
   * Function called on touch
   */
  onTouched: () => void;

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   * @param changeDetectorRef reference to the Angular change detection service
   */
  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) { }

  /**
   * Allow a user to point at an image on the internet so that it's not just embedded in the text.
   */
  ngAfterViewInit(): void {
    const editorElement = this.editor.nativeElement;
    const toolbarElement = this.toolbar.nativeElement;

    this.quill = new Quill(editorElement, {
      modules: { toolbar: toolbarElement },
      placeholder: this.placeholder,
      readOnly: this.readonly,
      theme: null,
      formats: null,
      bounds: null,
      debug: null,
      scrollingContainer: null
    });

    // disable tabbing in editor
    delete this.quill.getModule('keyboard').bindings['9'];

    if (!!this.value) {
      this.quill.setContents(this.quill.clipboard.convert(this.value));
    }

    this.quill.on('text-change', (delta, oldContents, source) => {
      if (source === 'user') {
        let html = editorElement.children[0].innerHTML;
        const text = this.quill.getText().trim();
        if (html === '<p><br></p>') {
          html = null;
        }

        this.textChanged.emit({
          htmlValue: html,
          textValue: text,
          delta: delta,
          source: source
        });

        this.onChange(html);
        this.onTouched();
      }
    });

    this.quill.on('selection-change', (range, oldRange, source) => {
      this.selectionChanged.emit({
        range: range,
        oldRange: oldRange,
        source: source
      });
    });

    this.init.emit({
      editor: this.quill
    });

    this.quill.getModule('toolbar').handlers.image = () => {
      const range = this.quill.getSelection();
      const value = prompt('Please enter the image URL');
      this.quill.insertEmbed(range.index, 'image', value, 'user');
    };

    this.applyAccessibilityHacks(this.quill);
  }

  /**
   * Destroy component, invoke keyup unlisten functions
   */
  ngOnDestroy(): void {
    for (const unlistener of this.keyupUnlisteners) {
      unlistener();
    }

    this.keyupUnlisteners = [];
  }

  /**
   * Register change function
   * @param fn the function to call on change
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register touched function
   * @param fn the function to call on touch
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled state
   * @param isDisabled whether or not the control is disabled
   */
  setDisabledState(isDisabled: boolean): void { }

  /**
   * Write to the editor
   * @param value the value to write
   */
  writeValue(value: any): void {
    this.value = value;

    if (this.quill) {
      if (!!value) {
        this.quill.setContents(this.quill.clipboard.convert(value));
      } else {
        this.quill.setText('');
      }
    }
  }

  /**
   * Listen for editor focus on tab
   * @param event the keyup KeyboardEvent
   */
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      this.editorFocused = document.activeElement.classList.contains('ql-editor');
    }
  }

  /**
   * Listen for editor focus on click
   */
  @HostListener('window:click')
  onClick(): void {
    this.editorFocused = document.activeElement.classList.contains('ql-editor');
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

        this.keyupUnlisteners.push(
          this.renderer.listen(item, 'keyup', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
              item.click();
              optionsContainer.setAttribute('aria-hidden', 'true');
            }
          })
        );
      }

      this.keyupUnlisteners.push(
        this.renderer.listen(label, 'keyup', (event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            label.click();
            optionsContainer.setAttribute('aria-hidden', 'false');
          }
        })
      );
    }
  }
}
