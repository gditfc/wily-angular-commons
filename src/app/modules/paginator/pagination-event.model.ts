export class PaginationEvent {

  activePage: number;
  pageSize: number;
  totalLength: number;

  constructor(activePage: number, pageSize: number, totalLength: number) {
    this.activePage = activePage;
    this.pageSize = pageSize;
    this.totalLength = totalLength;
  }

}
