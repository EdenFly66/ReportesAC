import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { query, collection, getDocs, where, setDoc } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent {

  nombreUsuario?:string;
  rol?:string;
  constructor(private usuarioService:UsuarioService, private firestore:Firestore,private router:Router){

  }

  

  ngOnInit(){
    this.obtenerData()
  }

  async obtenerData(){
    const id = await this.usuarioService.getUid()
    const q = query(collection(this.firestore,'Usuarios'),where("UID","==",id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Usuario
      this.nombreUsuario = datos.nombre
      this.rol = datos.rol
    })

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
