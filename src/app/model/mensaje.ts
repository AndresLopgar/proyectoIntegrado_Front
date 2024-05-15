import { Usuario } from './usuario';

export class Mensaje {
  id!: number;
  contenido!: string;
  fechaEnvio!: Date;
  remiteUsuario!: Usuario;
  destinoUsuario!: Usuario;
}