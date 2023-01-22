import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signOut } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { FirebaseErrorService } from './firebase-error.service';
import { addDoc, collection, Firestore, getDocs, query } from '@angular/fire/firestore';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { async } from 'rxjs';
import { deleteDoc, doc, setDoc, where } from 'firebase/firestore';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  show:boolean = true
  nombre?:string

  constructor(private afAuth:AngularFireAuth, private auth:Auth, private firebaseError:FirebaseErrorService, private firestore:Firestore, private router:Router) { 

  }

  async getUid(){
    const user = await this.afAuth.currentUser;
    if(user === undefined){
      return null;
    }
    else{
      return user?.uid;
    }
  }

  conexion(){
    if(this.getUid()===null){
      return false
    }
    return true
  }

  cerrarSesion(){
    return signOut(this.auth).then(()=>{
      Swal.fire({
        title: 'Has salido con éxito',
        text: 'Vuelve pronto.',
        icon: 'success',
        allowOutsideClick: false,
      })
    });
  }

  iniciarSesion(correo:any,contrasena:any):void{
    this.afAuth.signInWithEmailAndPassword(correo,contrasena).catch((error)=>
      alert(this.firebaseError.firebaseError(error.code))
    )
  }

  verificarCorreo(){
    this.afAuth.currentUser.then(user=> user?.sendEmailVerification())
  }

  async guardarUsuario(correo:string,rol:string,nombre:string){
    const id:string = await this.getUid() as unknown as string;
    const ref = collection(this.firestore,'Usuarios');
    Swal.fire({
      title: '¡Registrado!',
      text: 'Verifica tu correo antes de iniciar sesión.',
      icon: 'success',
      allowOutsideClick: false,
    })

    return setDoc(doc(ref,id),{
      "UID":id,
      "rol":rol,
      "correo":correo,
      "nombre":nombre,
    })
  }
  
  recuperarContrasena(email:any){
    this.afAuth.sendPasswordResetEmail(email).then(()=>{
      Swal.fire({
        title: '¡Correo enviado!',
        text: 'Revisa tu correo electrónico.',
        icon: 'success',
        allowOutsideClick: false,
      })
      this.router.navigate([''])
    }).catch((error)=>{
      this.firebaseError.firebaseError(error.code);
    })
  }

  borrarUsuario(usuario:Usuario){
    
  }

}
