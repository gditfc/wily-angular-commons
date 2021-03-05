/**
 * Interface representing a multi-select option
 */
export interface MultiSelectOption {

  /**
   * The value of the multi-select option
   */
  value: string | number;

  /**
   * The label of the multi-select option
   */
  label: string;

  /**
   * Whether or not the option is disabled
   */
  disabled?: boolean;

  /**
   * Data context object containing properties to fill
   * multi-select option template placeholders
   */
  dataContext?: { [key: string]: unknown };
}
