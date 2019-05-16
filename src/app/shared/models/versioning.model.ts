import {Auditable} from './auditable.model';

/**
 * Objects that can be versioned use this
 */
export class Versioning extends Auditable {

  /**
   * The version
   */
  version: string;

  /**
   * Associated Approval
   */
  approvalId: number;

  /**
   * Status of the Approval
   */
  approvalStatus: string;

}
