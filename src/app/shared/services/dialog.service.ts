import {Injectable} from '@angular/core';
import {WilyDialogLegacyComponent} from '../../modules/wily-dialog-legacy/wily-dialog-legacy.component';
import {WilyDialogComponent} from '../../modules/wily-dialog/wily-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogs: WilyDialogComponent[] = [];

  private escapeListener: (event) => void = event => {
    if (event.key === 'Esc' || event.key === 'Escape') {
      if (this.dialogs && this.dialogs.length) {
        const topDialog = this.dialogs.pop();
        topDialog.close();
        event.stopPropagation();
      }
    }
  }

  registerDialog(dialog: WilyDialogComponent): void {
    if (dialog) {
      if (this.dialogs.length === 0) {
        window.addEventListener( 'keyup', this.escapeListener);
        document.body.classList.add('scroll_none');
      }
      this.dialogs.push(dialog);
    }
  }

  unregisterDialog(dialog: WilyDialogComponent): void {
    if (this.dialogs.includes(dialog)) {
      this.dialogs = this.dialogs.filter(d => d !== dialog);
    }
    if (this.dialogs.length === 0) {
      window.removeEventListener( 'keyup', this.escapeListener);
      document.body.classList.remove('scroll_none');
    }
  }

}
