import {DropdownOption} from './dropdown-option.model';

/**
 * Interface representing an array of dropdown options
 * grouped under a label
 */
export interface DropdownOptionGroup {

  /**
   * The option group label
   */
  groupLabel: string;

  /**
   * The group options
   */
  options: Array<DropdownOption>;
}
