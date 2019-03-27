import {Auditable} from './auditable.model';

export class Versioning extends Auditable {

  version: string;
  approvalId: number;
  approvalStatus: string;

}
