import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { right } from '@popperjs/core';


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

    //Notificacion de Renta

    doc.setFontSize(7).setTextColor(59,131,189).setFont('calibri')
    doc.text('Auditoría Contable SpA     //     Rut 77.043.495-5', 35, 25);
    doc.text('Auditoría, Capacitación, Análisis y Gestión:',35,28);
    doc.text('Contable, Tributaria, Laboral y Financiera.',35,31);
    doc.text('56966047797 / auditoriacontable.cl@gmail.com',35,34);
    //doc.addImage("https://acontable.appzone.cl/assets/img/logo-acontable.png","JPEG",50,20,70,40) 
    
    doc.setFontSize(10).setTextColor(0,0,0).setFont('calibri','bold');
    doc.text("Informativo Renta 2020",87,70);

    doc.setFontSize(9).setFont('calibri','roman');
    doc.text('Panguipulli 09 de mayo de 2020',135,85);

    doc.text("Estimado Cliente:",35,98);
    
    doc.setFont('calibri','bold').setFontSize(10);
    doc.text(fila[4],35,110) ;

    doc.setFont('calibri','roman');
    doc.text("RUT:",35,115);

    doc.setFont('calibri','bold');
    doc.text(fila[1],45,115);

    doc.setFont('calibri','roman').setFontSize(10);
    doc.text("                                               Junto con saludarle muy cordialmente nos dirigimos a Usted para informarle el resultado de su declaración de renta correspondiente al año tributario 2020, esto es respecto de sus operaciones comerciales durante el año 2019:",35,135, {align: 'justify',lineHeightFactor: 1.5,maxWidth:140});
    

    doc.text("Monto a : ",35,160);
    doc.text("Le saluda muy atentamente:",35,105);

    doc.setFontSize(8);
    doc.line(85,233,130,233);
    doc.text("Equipo de Rentas",98.5,240);
    doc.text("Auditoría Contable SpA.",95,250);

    //doc.save("AC-Notificación Renta "+fila[4]+".pdf"); 

    ///Informativo Previo de Renta
    let doc2 = new jsPDF();

    doc2.setFontSize(7).setTextColor(59,131,189).setFont('calibri');
    doc2.text('Auditoría Contable SpA     //     Rut 77.043.495-5', 35, 25);
    doc2.text('Auditoría, Capacitación, Análisis y Gestión:',35,28);
    doc2.text('Contable, Tributaria, Laboral y Financiera.',35,31);
    doc2.text('56966047797 / auditoriacontable.cl@gmail.com',35,34);

    doc2.setFontSize(10).setTextColor(0,0,0).setFont('calibri','bold');
    doc2.text("Informativo Renta 2020",87,70);

    doc2.setFontSize(9).setFont('calibri','roman');
    doc2.text('Panguipulli 09 de mayo de 2020',135,85);

    //doc2.save("AC-Informativo Previo Renta "+fila[4]+".pdf");

    let doc3 = new jsPDF();
    doc3.setFontSize(6).setTextColor(0,0,0).setFont('calibri','bold');
    doc3.text('PODER',95,30);

    doc3.setFont('calibri','roman');
    doc3.text("Comparece:     "+fila[64],40,45);
    doc3.text(" En Representación de: ",40,45);
    doc3.setFont('calibri','bold');
    doc3.text(fila[4],40,60);
    doc3.setFont('calibri','roman');
    doc3.text("                                  RUT: ",40,45);
    doc3.setFont('calibri','bold');
    doc3.text(fila[2],40,60);
    doc3.setFont('calibri','roman');
    doc3.text("Con domicilio comercial en:  ",40,45);
    doc3.setFont('calibri','bold');
    doc3.text(fila[60],40,60);

    doc3.save("AC-Poder SII - "+fila[4]+".pdf");

  }

  generarTodosReportes(){
    for(let i = 1; i<this.excelData.length; i++){
      this.generarReporte(this.excelData[i])
    }
  }
  
}
