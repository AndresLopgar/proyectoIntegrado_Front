import { Routes} from '@angular/router';
import { BuscarComponent } from './components/buscar/buscar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ModerarComponent } from './components/moderar/moderar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistroComponent } from './components/registro/registro.component';
import { CompaniaComponent } from './components/compania/compania.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    {path: 'registro', component: RegistroComponent},
    { path: 'perfil/:id', component: PerfilComponent },
    {path: 'buscar', component: BuscarComponent},
    {path: 'moderar', component: ModerarComponent},
    {path: 'compania/:id', component: CompaniaComponent},
    { path: '**', redirectTo: '/home' }
];
