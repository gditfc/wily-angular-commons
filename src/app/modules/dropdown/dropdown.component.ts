import {Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild} from '@angular/core';

/**
 * Dropdown component
 * TODO: aria-label input
 * TODO: accessibility arrow-key controls
 * TODO: support placeholder
 * TODO: make dropdown option (with value/label)
 * TODO: open option list above/below dropdown based on available space
 * TODO: escape/click outside to close
 * TODO: close list on selection
 */
@Component({
  selector: 'wily-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

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
   * Open the dropdown list and align it
   */
  openDropdown(): void {
    this.opened = true;
    this.positionDropdownList();
    this.resizeDropdownList();
  }

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
    this.renderer.setStyle(this.dropdownList.nativeElement, 'top', `${positionTop}px`);
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
