/**
 * The Data List is a wrapper class of Arrays returned from an endpoint. This makes it easy to unpack the list automagically.
 */
export class DataList<T> {
  /**
   * The field that holds a List of data
   */
  data: T[];
}
