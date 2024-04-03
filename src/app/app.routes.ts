import { Routes} from '@angular/router';
import { BuscarComponent } from './components/buscar/buscar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MensajesComponent } from './components/mensajes/mensajes.component';
import { ModerarComponent } from './components/moderar/moderar.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistroComapaniaComponent } from './components/registro-comapania/registro-comapania.component';
import { RegistroComponent } from './components/registro/registro.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    {path: 'registro', component: RegistroComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'buscar', component: BuscarComponent},
    {path: 'mensajes', component: MensajesComponent},
    {path: 'notificaciones', component: NotificacionesComponent},
    {path: 'moderar', component: ModerarComponent},
    {path: 'companiaRegistro', component: RegistroComapaniaComponent}
];
