import { Usuario } from './usuario';

export class MensajeDirecto {
  id!: number;
  contenido!: string;
  fechaEnvio!: Date;
  remiteUsuario!: Usuario;
  destinoUsuario!: Usuario;
}
