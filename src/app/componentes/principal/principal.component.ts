import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { right } from '@popperjs/core';
import { Cliente } from 'src/app/interfaces/cliente';


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
  listaClientes:Array<Cliente>=[] ;
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
    
  }

  procesoProductivo(cell:string,index:number){
    
    return false
  }
  
  generarReporte(fila:Array<any>){
    this.generarListaClientes()
    //this.notificacionRenta(fila)
    this.informativoPrevio(fila)
    //this.poderSII(fila)
  }

  generarListaClientes(){
    this.listaClientes = []
    for(let i = 0; i<this.excelData.length; i++){
      let nro:string = this.excelData[i][0]
      if(this.excelData[i][64]!=undefined && nro!=undefined){
        nro = nro as unknown as string
        let guardar = true;
        for(let j = 0; j<this.listaClientes.length; j++){
          if(nro.substring(0,1)==this.listaClientes[j].nro && this.excelData[i][3]==this.listaClientes[j].cliente){
            guardar = false
          }
        }
        if(guardar){
          let obj:Cliente = Object.assign({
          'nro':nro.substring(0,1),
          'nomRL':this.excelData[i][64],
          'cliente':this.excelData[i][3],
          })
          this.listaClientes.push(obj)
        }
        
      }
    }
    console.log(this.listaClientes)
  }

  generarTodosReportes(){
    for(let i = 1; i<this.excelData.length; i++){
      this.generarReporte(this.excelData[i])
    }
  }
  
  notificacionRenta(fila:Array<any>){
    let doc = new jsPDF();

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

    doc.save("AC-Notificación Renta "+fila[4]+".pdf"); 
  }

  informativoPrevio(fila:Array<any>){
    let doc = new jsPDF();
    doc.setFontSize(7).setTextColor(59,131,189).setFont('calibri');
    doc.text('Auditoría Contable SpA     //     Rut 77.043.495-5', 35, 25);
    doc.text('Auditoría, Capacitación, Análisis y Gestión:',35,28);
    doc.text('Contable, Tributaria, Laboral y Financiera.',35,31);
    doc.text('56966047797 / auditoriacontable.cl@gmail.com',35,34);

    doc.setFontSize(10).setTextColor(0,0,0).setFont('calibri','bold');
    doc.text("Informativo Renta 2020",87,70);

    doc.setFontSize(9).setFont('calibri','roman');
    doc.text('Panguipulli 09 de mayo de 2020',135,85);

    doc.text('Estimado (a) cliente:',35,105 )
    doc.text(fila[3]+'Junto con saludarle muy cordialmente nos dirigimos a Usted para informarle de la situación tributaria desde el 01 de enero al 30 de noviembre de 2022 de su empresa:',35,115,{align: 'justify',lineHeightFactor: 1.5,maxWidth:140})

    doc.save("AC-Informativo Previo Renta "+fila[4]+".pdf");
  }

  poderSII(fila:Array<any>){
    let doc = new jsPDF();
    let RL:string = this.obtenerRL(fila);

    doc.setFontSize(9).setFont('calibri','bold');
    doc.text('PODER',95,30)
    doc.setFont('calibri','roman');
    doc.text("Comparece:     ",40,45);
    doc.setFont('calibri','bold');
    doc.text(RL,70,45)
    doc.setFont('calibri','roman')
    doc.text("En Representación de: ",40,50);
    doc.setFont('calibri','bold');
    doc.text(fila[4],70,50)
    doc.setFont('calibri','roman')
    doc.text('RUT:',40,55)
    doc.setFont('calibri','bold');
    doc.text(fila[1],50,55);
    doc.setFont('calibri','roman');
    doc.text("Con domicilio comercial en:  ",40,60);
    doc.setFont('calibri','bold');
    if(fila[60]!=undefined){
      doc.text(fila[60],80,60);
    }

    doc.setFont('calibri','roman');
    doc.text('Viene en conferir poder especial a:',40,70)
    doc.text('RICARDO JAVIER ULLOA GONZÁLEZ                                                                                  C.I. 15.439.049-9',40,85)
    doc.text('NAYARETH MARILYN RIOS MONTECINOS                                                                         C.I. 21.574.446-9',40,90)
    
    
    doc.setFontSize(9).setFont('calibri','roman');
    doc.text('Para que en su nombre y representación proceda(a) a efectuar cualquier tipo de trámite ante el S.I.I. \nFirmar y presentar el formulario 4415 (iniciación de actividades).\nFirmar y presentar rectificatoria de formularios 29 (iva) y 22(renta).\nFirmar y presentar el formulario 3239 (modificaciones, actualizaciones, etc.).\nFirmar y presentar formulario 4418 (solicitud de verificación de actividad).\nFirmar y presentar el formulario 3230 (timbraje de libros y documentos tributarios).\nFirmar y solicitar Clave Internet S.I.I. \nFirmar, solicitar y gestionar el TERMINO DE GIRO ante el S.I.I.\nFirmar, solicitar y tramitar la PATENTE COMERCIAL respectiva de sus establecimientos comerciales.\nFirmar, solicitar y tramitar en TESORERIA GENERAL DE LA REPUBLICA, clave internet, certificados de distinta índole en esta institución, inclusive información y documentos respecto de procesos judiciales y cobranzas.\nAl efecto, se le otorga al mandatario todas las facultades que sean menester para llevar a cabo el correcto y fiel desempeño de su cometido.', 40, 110,{align: 'left',lineHeightFactor: 1.5,maxWidth:140});
    
    doc.line(65,195,150,195);
    doc.text('Firmó ante mí, previa lectura, JONES CLAYTON SWAYNE, 27690867-7.',60,210)
    doc.save("AC-Poder SII - "+fila[4]+".pdf");
    
  }

  obtenerRL(fila:Array<string>){
    for(let i = 0; i<this.listaClientes.length ; i++){
      if(fila[0].substring(0,1)==this.listaClientes[i].nro && fila[3]==this.listaClientes[i].cliente){
        return this.listaClientes[i].nomRL
      }
    }
    return ''
  }

}
