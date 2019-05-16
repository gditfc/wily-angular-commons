/**
 * Representation of a pagination event
 */
export class PaginationEvent {

  /**
   * Current Page
   */
  activePage: number;

  /**
   * Size of a Page
   */
  pageSize: number;

  /**
   * Total Size to paginate over
   */
  totalLength: number;

  /**
   * Constructor that takes all variables to easily emit it in the event of pagination or page size change.
   * @param activePage
   * @param pageSize
   * @param totalLength
   */
  constructor(activePage: number, pageSize: number, totalLength: number) {
    this.activePage = activePage;
    this.pageSize = pageSize;
    this.totalLength = totalLength;
  }

}
