import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { doc, getDoc } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss']
})
export class CabeceraComponent {
  nombreUsuario?:string;
  rol?:string;
  constructor(private usuarioService:UsuarioService, private firestore:Firestore,private router:Router){

  }

  

  ngOnInit(){
    this.obtenerData()
  }

  async obtenerData(){
    const id:string = await this.usuarioService.getUid() as unknown as string;
    const docRef = doc(this.firestore,"Usuarios",id);
    const docSnap = await getDoc(docRef);
    const data:Usuario = docSnap.data() as unknown as Usuario;
    this.rol = data.rol
    this.nombreUsuario = data.nombre
  }

  cerrarSesion(){
    this.usuarioService.cerrarSesion().then(()=>{
      this.router.navigate([''])
    })
  }
  redirigir(){
    this.router.navigate(['/registrar'])
  }

  cambiarRol(){
    this.router.navigate(['/rol'])
  }

}
