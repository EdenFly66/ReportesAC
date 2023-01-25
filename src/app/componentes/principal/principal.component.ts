import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent {

  show? : boolean;
  nombreUsuario?:string;
  rol?:string;
  excelData: Array<any>=[] as any;
  newTabla: Array<any> = [] as any;
  content = 'soy contenido'
  constructor(private usuarioService:UsuarioService, private firestore:Firestore,private router:Router){

  }

  ngOnInit(){
    this.show = false;
  }

  readExcel(event:any){
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    this.show = true
    fileReader.onload = (e)=>{
      var workbook = XLSX.read(fileReader.result,{type:'binary', cellDates:true});
      var sheetNames = workbook.SheetNames;
      this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]], {header: 1, raw:false, dateNF:'yyyy-mm-dd HH:mm:ss'});
    }
    console.log(this.excelData[1])
  }

  procesoProductivo(cell:string,index:number){
    
    return false
  }
  
  generarReporte(fila:Array<any>){
    let doc = new jsPDF();

    doc.text('hola'+fila[3], 10, 10); //cambiar x, y   agregar opcional para formatos
    doc.save(fila[3]+fila[0]+".pdf");
  }

  generarTodosReportes(){
    for(let i = 1; i<this.excelData.length; i++){
      this.generarReporte(this.excelData[i])
    }
  }
  /*crearReportes(){
    const documentCreator = new DocumentCreator(); //crear interface
    const doc = documentCreator.create([
      experiences,
      education,
      skills,
      achievements
    ]);

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  }*/
}
