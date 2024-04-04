export class usuario{
    idUsuario!: number;
    nombreUsuario!: string;
    edad!: number;
    correoElectronico!: string;
    password!: string;
    profesion!: string;
    fechaRegistro!: string;
    fotoPerfil!: Uint8Array;
    tipoUsuario!: string;
}

export const usuariosMock: usuario[] = [
    {
        idUsuario: 1,
        nombreUsuario: 'Usuario1',
        edad: 18,
        correoElectronico: 'usuario1@example.com',
        password: 'contraseña1',
        profesion: 'bailarin',
        fechaRegistro: '2024-04-01',
        fotoPerfil: new Uint8Array(),
        tipoUsuario: 'registrado'
    },
    {
        idUsuario: 2,
        nombreUsuario: 'Usuario2',
        edad: 18,
        correoElectronico: 'usuario2@example.com',
        password: 'contraseña2',
        profesion: 'actriz',
        fechaRegistro: '2024-04-02',
        fotoPerfil: new Uint8Array(),
        tipoUsuario: 'noRegistrado'
    },
    {
        idUsuario: 3,
        nombreUsuario: 'Usuario3',
        edad: 18,
        correoElectronico: 'usuario3@example.com',
        password: 'contraseña3',
        profesion: 'escenógrafo',
        fechaRegistro: '2024-04-03',
        fotoPerfil: new Uint8Array(),
        tipoUsuario: 'gestor'
    }
];