import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { NotificationService } from './services/notification.service';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule],
  exports: [NotificationComponent],
  providers: [NotificationService]
})
export class NotificationModule { }
