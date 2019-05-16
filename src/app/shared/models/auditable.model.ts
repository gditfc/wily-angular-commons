/**
 * Auditable Class - Holds the creation and modification data that is known for most DB interactions
 */
export class Auditable {

  /**
   * Who Created it
   */
  createdBy: string;

  /**
   * When it was created
   */
  createdTime: Date;

  /**
   * Who last modified it
   */
  modifiedBy: string;

  /**
   * When it was last modified
   */
  modifiedTime: Date;
}
