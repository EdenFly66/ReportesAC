import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IngresarComponent } from './componentes/ingresar/ingresar.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { RegistrarComponent } from './componentes/registrar/registrar.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';

import { Routes, RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RecuperarComponent } from './componentes/recuperar/recuperar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolComponent } from './componentes/rol/rol.component';
import { CabeceraComponent } from './componentes/cabecera/cabecera.component';

const appRoutes:Routes=[
  {path:'',component:IngresarComponent},
  {path:'registrar',component:RegistrarComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'recuperar',component:RecuperarComponent},
  {path:'principal',component:PrincipalComponent,...canActivate(()=>redirectUnauthorizedTo(['']))},
  {path:'rol',component:RolComponent,...canActivate(()=>redirectUnauthorizedTo(['']))}
]

@NgModule({
  declarations: [
    AppComponent,
    IngresarComponent,
    PrincipalComponent,
    RegistrarComponent,
    RecuperarComponent,
    RolComponent,
    CabeceraComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
