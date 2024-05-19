import { Comentario } from "./comentario";

export class Publicacion{
    id!: number;
    contenido!: string;
    fechaPublicacion!: string;
    meGusta!: boolean;
    numMeGustas!:number;
    idUsuario!: number;
    idCompania!: number;
    comentarios!: Comentario[];
}