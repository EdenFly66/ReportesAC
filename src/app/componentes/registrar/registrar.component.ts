import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseErrorService } from 'src/app/servicios/firebase-error.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent {
  formulario: FormGroup;
  roles: Array<string> = ['Usuario','Admin']

  constructor(private readonly fb: FormBuilder, private afAuth: AngularFireAuth, private router:Router, private firebaseError:FirebaseErrorService, private userSv:UsuarioService){
    this.formulario = this.fb.group({
      correo: ['',[Validators.required, Validators.email],],
      nombre:['',[Validators.required],],
      rol:['',[Validators.required],],
      contrasena:['',[Validators.required]],
      contrasena2:['',[]],
    })
  }

  compararContrasenas():boolean{
    return this.formulario.value.contrasena==this.formulario.value.contrasena2
  }

  registrar(){
    const email = this.formulario.value.correo;
    const password1 = this.formulario.value.contrasena;
    const rol = this.formulario.value.rol;
    const nombre = this.formulario.value.nombre;
    if(this.formulario.value.correo==="" || this.formulario.value.contrasena==="" || this.formulario.value.contrasena2==="" || this.formulario.value.rol==="" || this.formulario.value.rol==="Rol"){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Faltan datos por completar.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else if(!this.compararContrasenas()){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Tus contraseñas no coinciden.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    else{
      this.afAuth.createUserWithEmailAndPassword(email,password1).then(()=> {
      this.router.navigate(['/principal']);
      this.userSv.verificarCorreo();
      this.userSv.guardarUsuario(email,rol,nombre);
      }).catch((error)=>{
        alert(this.firebaseError.firebaseError(error.code))
      });
    }
    
  }

  volver(){
    this.router.navigate(['/principal'])
  }
}
