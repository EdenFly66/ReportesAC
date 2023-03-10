import { Component } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { doc, orderBy, setDoc } from 'firebase/firestore';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.scss']
})
export class RolComponent {

  formulario:any;
  roles: Array<string> = ['Usuario','Admin']
  usuarios:Array<Usuario>=[]
  constructor(private firestore:Firestore, private usuarioService:UsuarioService, private readonly fb: FormBuilder){
    this.formulario = this.fb.group({
      rol:['',[],],
      usuario:['',[],],
    })
  }

  ngOnInit(){
    this.obtenerUsuarios()
  }

  async obtenerUsuarios(){
    const id = await this.usuarioService.getUid()
    const q = query(collection(this.firestore,'Usuarios'),where("UID","!=",id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(e => {
      const datos = e.data() as Usuario
      this.usuarios.push(datos)
    })
  }
  
  async editarRol(){
    if(this.formulario.value.rol=="" || this.formulario.value.rol=="Rol:" || this.formulario.value.usuario==""  || this.formulario.value.usuario=="Empleado:"){
      console.log('tirar alerta')
    }
    else{
      let usuarioToUpdate!:Usuario;
      for(let i = 0; i< this.usuarios.length ; i++){
        if(this.usuarios[i].nombre==this.formulario.value.usuario){
          usuarioToUpdate = this.usuarios[i]
        }
      }
      const ref = collection(this.firestore,'Usuarios');
      return setDoc(doc(ref,usuarioToUpdate.UID),{
        "UID":usuarioToUpdate.UID,
        "rol":this.formulario.value.rol,
        "correo":usuarioToUpdate.correo,
        "nombre":usuarioToUpdate.nombre,
      })
      
    }
    
  }
}
