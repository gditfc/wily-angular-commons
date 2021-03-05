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

  // TODO: Figure out how to intercept escape listeners from calendar/dropdown to prevent dialog closing
  registerDialog(dialog: DialogComponent): void {
    if (dialog) {
      if (this.dialogs.length === 0) {
        window.addEventListener( 'keyup', this.escapeListener);
        document.body.classList.add('scroll_none');
      }
      this.dialogs.push(dialog);
    }
  }

  unregisterDialog(dialog: DialogComponent): void {
    if (this.dialogs.includes(dialog)) {
      this.dialogs = this.dialogs.filter(d => d !== dialog);
    }
    if (this.dialogs.length === 0) {
      window.removeEventListener( 'keyup', this.escapeListener);
      document.body.classList.remove('scroll_none');
    }
  }

}
