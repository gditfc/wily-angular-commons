import {Injectable} from '@angular/core';
import {DialogComponent} from '../../modules/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogs: DialogComponent[] = [];

  private escapeListener: (event) => void = event => {
    if (event.key === 'Esc' || event.key === 'Escape') {
      if (this.dialogs && this.dialogs.length) {
        const topDialog = this.dialogs.pop();
        topDialog.close();
        event.stopPropagation();
      }
    }
  }

  registerDialog(dialog: DialogComponent): void {
    if (this.dialogs.length === 0) {
      window.addEventListener( 'keyup', this.escapeListener);
    }
    this.dialogs.push(dialog);
  }

  unregisterDialog(dialog: DialogComponent): void {
    if (this.dialogs.includes(dialog)) {
      this.dialogs = this.dialogs.filter(d => d !== dialog);
    }
    if (this.dialogs.length === 0) {
      window.removeEventListener( 'keyup', this.escapeListener);
    }
  }

}
