import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Compania } from '../../model/compania';
import { CompaniaService } from '../../services/compania.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compania',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './compania.component.html',
  styleUrl: './compania.component.scss'
})
export class CompaniaComponent  implements OnInit{
  @ViewChild('upadteForm') CreacionCompaniaForm!: NgForm; // Referencia al formulario
  compania!: Compania;
  companiaId!: number;
  usuarioId!: number;
  mostrandoFormularioModificar: boolean = false;

  constructor(private companiaService: CompaniaService, private route: ActivatedRoute,private router: Router){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companiaId = +params['id'];
      const usuarioLocalStorage = localStorage.getItem('usuario');
      if (usuarioLocalStorage) {
        const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
        this.usuarioId = usuarioAlmacenado.id;
      }
      this.loadCompania();
    })
  }

  loadCompania(){
    this.companiaService.getCompaniaById(this.companiaId).subscribe(
      (compania) => {
        this.compania = compania;
        console.log('Compañía cargada exitosamente:', this.compania);
      },
      (error) => {
        console.error('Error al cargar la compañía:', error);
      })
  }

  async eliminarCompania(id: number) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la compañía y no se podrá deshacer más tarde.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this.companiaService.deleteCompania(id).toPromise();
        console.log(`Compañía con ID ${id} eliminada correctamente`);
        await this.router.navigateByUrl('/'); // Redirigir a la página principal o a donde desees
        Swal.fire({
          icon: 'success',
          title: 'Eliminación de compañía exitosa',
          text: '¡Compañía eliminada correctamente!'
        });
      } catch (error) {
        console.error('Error al eliminar la compañía:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '¡Error al eliminar la compañía!'
        });
      }
    } else {
      console.log('La acción ha sido cancelada');
    }
  }

  async modificarCompania() {
    try {
      await this.companiaService.updateCompania(this.compania.id, this.compania).toPromise();
      console.log('Compañía modificada exitosamente.');
      this.mostrandoFormularioModificar = false;
      Swal.fire({
        icon: 'success',
        title: 'Modificación de compañía exitosa',
        text: '¡Compañía modificada correctamente!'
      });
    } catch (error) {
      console.error('Error al modificar la compañía:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: '¡Error al modificar la compañía!'
      });
    }
  }

  mostrarFormularioModificar(): void {
    this.mostrandoFormularioModificar = true;
  }

  cancelarModificacion(): void {
    this.mostrandoFormularioModificar = false;
    Swal.fire({
      icon: 'warning',
      title: 'Advertencia',
      text: '¡Modificación de usuario cancelada!'
    });
  }
}
