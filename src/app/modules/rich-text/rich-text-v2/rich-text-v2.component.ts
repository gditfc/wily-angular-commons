import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

@Component({
  selector: 'wily-rich-text-v2',
  templateUrl: './rich-text-v2.component.html',
  styleUrls: ['./rich-text-v2.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RichTextV2Component implements OnInit {

  editor = new Editor({
    extensions: [StarterKit],
  });

  value = '<p>Hello, Tiptap!</p>'; // can be HTML or JSON, see https://www.tiptap.dev/api/editor#content

  constructor() { }

  ngOnInit(): void {
  }

}
