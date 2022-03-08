import {Auditable} from './auditable.model';

/**
 * Objects that can be versioned use this
 */
export class Versioning extends Auditable {

  /**
   * The version
   */
  version: string = null as any;

  /**
   * Associated Approval
   */
  approvalId: number = null as any;

  /**
   * Status of the Approval
   */
  approvalStatus: string = null as any;

  /**
   * Flag to determine if this item has a draft version
   */
  hasDraft: string = null as any;

  /**
   * Flag to determine if this item has a pending version
   */
  hasPending: string = null as any;

}
