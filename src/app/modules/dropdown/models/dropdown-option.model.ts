/**
 * Interface representing a dropdown option
 */
export interface DropdownOption {

  /**
   * The value of the dropdown option
   */
  value: string | number;

  /**
   * The label of the dropdown option
   */
  label: string;

  /**
   * Whether or not the option is disabled
   */
  disabled?: boolean;

  /**
   * Data context object containing properties to fill
   * dropdown option template placeholders
   */
  dataContext?: { [key: string]: unknown };
}
