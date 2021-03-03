import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';

/**
 * Dropdown component
 * TODO: accessibility arrow-key controls
 * TODO: make dropdown option (with value/label)
 * TODO: close list on selection
 */
@Component({
  selector: 'wily-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements AfterContentInit, OnInit {

  /**
   * The amount of offset (in pixels) to place between the dropdown
   * and its list overlay
   * @private
   */
  private static readonly DROPDOWN_LIST_OFFSET = 10;

  /**
   * ViewChild of the dropdown
   */
  @ViewChild('dropdown')
  dropdown: ElementRef<HTMLDivElement>;

  /**
   * ViewChild of the dropdown list
   */
  @ViewChild('dropdownList')
  dropdownList: ElementRef<HTMLDivElement>;

  /**
   * ContentChild of the dropdown option template
   */
  @ContentChild(TemplateRef)
  template: TemplateRef<HTMLElement>;

  @Input()
  options: Array<{ value: string | number, label: string, dataContext?: { [key: string]: unknown } }>

  /**
   * Placeholder text to display when no option is selected
   */
  @Input()
  placeholder = 'Make a selection';

  /**
   * Aria label text
   */
  @Input()
  ariaLabel = 'Make a selection';

  /**
   * Class list to assign to the dropdown
   */
  @Input()
  classList: string;

  /**
   * Whether or not the dropdown is open
   */
  opened = false;

  /**
   * Dependency injection site
   * @param renderer the Angular renderer
   */
  constructor(private renderer: Renderer2) { }

  /**
   * Init component
   */
  ngOnInit(): void { }

  /**
   * After content init
   */
  ngAfterContentInit(): void {
    console.log(this.template.elementRef.nativeElement);
  }

  /**
   * Reposition and resize the dropdown on window resize
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.opened) {
      this.positionDropdownList();
      this.resizeDropdownList();
    }
  }

  /**
   * Close the dropdown list on escape keyup
   * @param event the keyup KeyboardEvent
   */
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    const {key} = event;
    if (key === 'Esc' || key === 'Escape') {
      this.closeDropdown();
    }
  }

  /**
   * Close the dropdown list (if opened) on click if outside the list
   * @param event the click MouseEvent
   */
  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.opened) {
      const {pageX, pageY} = event;

      if (pageX > 0 && pageY > 0) {
        const { left, right, top, bottom } = this.dropdownList.nativeElement.getBoundingClientRect();
        const xPositionValid = pageX >= left && pageX <= right;
        const yPositionValid = pageY >= top && pageY <= bottom;
        const shouldClose = !(xPositionValid && yPositionValid);

        if (shouldClose) {
          this.closeDropdown();
        }
      }
    }
  }

  /**
   * Open the dropdown list and align it
   * @param event the click MouseEvent
   */
  openDropdown(event: MouseEvent): void {
    event.stopImmediatePropagation();

    this.opened = true;
    this.positionDropdownList();
    this.resizeDropdownList();
  }

  /**
   * Close the dropdown list
   */
  closeDropdown(): void {
    this.opened = false;
  }

  /**
   * Align the dropdown list with the dropdown
   * @private
   */
  private positionDropdownList(): void {
    const {left, top, bottom} = this.dropdown.nativeElement.getBoundingClientRect();
    const {offsetHeight} = this.dropdownList.nativeElement;
    const datePickerBottomLeftAnchor = bottom;
    const availableBottomSpace = window.innerHeight - datePickerBottomLeftAnchor;
    const availableTopSpace = top;
    const offsetListHeight = offsetHeight + DropdownComponent.DROPDOWN_LIST_OFFSET;
    let transformOrigin: string, positionTop: string;

    if (availableBottomSpace > offsetListHeight) {
      transformOrigin = 'top left';
      positionTop = `${datePickerBottomLeftAnchor + DropdownComponent.DROPDOWN_LIST_OFFSET}px`;
    } else if (availableTopSpace > offsetListHeight) {
      transformOrigin = 'bottom left';
      positionTop = `${top - offsetListHeight}px`;
    } else {
      if (offsetHeight > window.innerHeight) {
        positionTop = '0';
      } else {
        const availableSpace = window.innerHeight - offsetHeight;
        positionTop = String(availableSpace / 2);
      }
    }

    this.renderer.setStyle(this.dropdownList.nativeElement, 'transform-origin', transformOrigin);
    this.renderer.setStyle(this.dropdownList.nativeElement, 'left', `${left}px`);
    this.renderer.setStyle(this.dropdownList.nativeElement, 'top', positionTop);
  }

  /**
   * Match the dropdown list width to the dropdown's width
   * @private
   */
  private resizeDropdownList(): void {
    const { left, right } = this.dropdown.nativeElement.getBoundingClientRect();
    const width = right - left;

    this.renderer.setStyle(this.dropdownList.nativeElement, 'width', `${width}px`);
  }
}
