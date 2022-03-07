/**
 * Auditable Class - Holds the creation and modification data that is known for most DB interactions
 */
export class Auditable {

  /**
   * Who Created it
   */
  createdBy: string = null as any;

  /**
   * When it was created
   */
  createdTime: Date = null as any;

  /**
   * Who last modified it
   */
  modifiedBy: string = null as any;

  /**
   * When it was last modified
   */
  modifiedTime: Date = null as any;
}
