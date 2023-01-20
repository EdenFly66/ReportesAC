import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.scss']
})
export class RecuperarComponent {
  formulario:any

  constructor(private readonly fb: FormBuilder, private userSv:UsuarioService){
    this.formulario = this.fb.group({
      correo: ['',[Validators.required, Validators.email]],
    })
  }
  recuperar(){
    if(this.formulario.value.correo=="" || this.formulario.get('correo')?.errors?.['email']){
      Swal.fire({
        title: '¡Cuidado!',
        text: 'Hay algo incorrecto.',
        icon: 'warning',
        allowOutsideClick: false,
      })
    }
    this.userSv.recuperarContrasena(this.formulario.value.correo)
  }
}
