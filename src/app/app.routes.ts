import { Routes} from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { MensajesComponent } from './pages/mensajes/mensajes.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { ModerarComponent } from './pages/moderar/moderar.component';

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
];
