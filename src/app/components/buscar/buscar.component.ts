import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { usuario, usuariosMock } from '../../model/usuario';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.scss'
})
export class BuscarComponent {
  usuarios: usuario[] = usuariosMock;

  usuarioEstandarChecked: boolean = false;

  toggleCamposUsuarioEstandar(event: any) {
    this.usuarioEstandarChecked = event.target.checked;
  }

}
