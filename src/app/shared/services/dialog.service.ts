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
        let closeOverride = null;
        if ('getAttribute' in event.target) {
          closeOverride = (event.target as HTMLElement).getAttribute(
            'data-dialog-close-override'
          );
        }

        if (closeOverride === null || closeOverride === '') {
          const topDialog = this.dialogs[this.dialogs.length - 1];

          if (topDialog.allowClose) {
            this.dialogs.pop();
            topDialog.close();
            event.stopPropagation();
          }
        }
      }
    }
  }

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
