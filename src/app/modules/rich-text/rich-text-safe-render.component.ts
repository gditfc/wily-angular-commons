import {Component, Input} from "@angular/core";

@Component({
  selector: 'wily-rich-text-safe-render',
  template: `<div [innerHTML]="html | dompurify"></div>`
})
export class RichTextSafeRenderComponent {

  @Input()
  html = '';

}
