import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

/**
 * Generated class for the SafeStylePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'safeStyle',
})
export class SafeStylePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(style) {
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

}
