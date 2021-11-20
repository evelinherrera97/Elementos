import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public data: any;
  public porcentaje1: any;
  public porcentaje2: any;
  public array: any;
  public error = false;



  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const ab: ArrayBuffer = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(ab);

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <any>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      // console.log('EXCELL', this.data);

      this.constructData();
      this.validarFormato()

    };
    reader.readAsArrayBuffer(target.files[0]);
  }

  constructData() {
    this.array = [];
    for (let index = 0; index < this.data.length; index++) {
      this.array.push(
        {
          'toHaveVehicle': this.data[index][0],
          'toWilling': this.data[index][1],
          'toRent': this.data[index][2],
          'toHaveLicense': this.data[index][3]
        }
      )

    }
  }

  validarFormato() {
    this.error = false;
    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];
      for (let index = 0; index < element.length; index++) {
        const item = element[index];
        if (item === undefined) {
          this.error = true;
        }
      }
    }
    console.log('mostrar', this.error);
    
  }

  contador() {
    let contador = 0;
    let contador2 = 0
    let total = this.array.length - 2
    for (let index = 0; index < this.array.length; index++) {
      const element = this.array[index];
      if (element.toHaveVehicle != 'Ninguno' && element.toWilling === 'si') {
        contador++
      }
      if (element.toRent === 'si' && element.toHaveLicense === 'si') {
        contador2++
      }
    }
  
    this.porcentaje1 = ((contador / total ) * 100).toFixed(2);
    this.porcentaje2 = ((contador2 / total) * 100).toFixed(2);
  }

}
