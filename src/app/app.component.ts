import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { debounceTime, startWith, throttleTime } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wysiwyg';
  public Editor = ClassicEditor;
  editorModel!: string;
  template =
    `{{name}}
    <p>This is some sample content.</p>
      {{doctor}}
    `;

  nameControl = new FormControl('marco');
  editorControl = new FormControl(this.template);
  docControl = new FormControl('');

  ngOnInit(): void {

    this.nameControl.valueChanges.pipe(
      startWith('marco'),
    ).subscribe((value) => {
      if (value === null) return;
      console.log(value);
    });
    this.editorControl.valueChanges.pipe(
      throttleTime(500)
    ).subscribe((value) => {
      console.log(value);
    });
  }

  /**
  * Interpolates a string with the given context.
  * Ejemplo:
  * interpolate('Hello {{ name }}', { name: 'John Doe' });
  * @param template Es el html que se va a interpolar
  * @param context El context debe de tener un MAP del nombre de las variables y su valor
  * @example context = { name: 'John Doe' }
  * @param keepFormat Si se quiere mantener el formato de {{ name }} en el html
  * @returns El html interpolado
  */

  interpolate(template: any, context: any, keepFormat = false) {
    const regex = /\{\{\s*(\w+)\s*\}\}/g // elimina {{ }}
    return template.replace(regex, (_: any, p1: string | number) => {
      if (keepFormat) return `{{${context[p1] || p1}}}`;
      return context[p1] || p1;
    });
  }


  previewDocument() {
    const previeEl = document.getElementById('preview')?.innerHTML;
    if (previeEl) {
      document.getElementById('preview')?.removeChild(document.getElementById('preview')?.firstChild as Node);
    }
    const iframe = document.createElement('iframe');
    iframe.srcdoc = this.interpolate(this.editorControl.value, { name: this.nameControl.value, doctor: this.docControl.value }) || '';
    iframe.style.width = '100%';
    iframe.style.height = '1000px';
    iframe.style.border = 'none';
    document.getElementById('preview')?.appendChild(iframe);
  }

}
