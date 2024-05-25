import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../model/usuario';
import { AmistadService } from '../../services/amistad.service';
import { Amistad } from '../../model/amistad';
import { ActivatedRoute } from '@angular/router';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chatMessage';
import { FormsModule } from '@angular/forms';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule],
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.scss']
})
export class MensajesComponent implements OnInit {
  allUsuarios!: Usuario[];
  usuariosEnAmistad!: Usuario[];
  amistadesBySeguidor!: Amistad[];
  usuarioId!: string;
  estaEnAmistad: boolean = false;
  usuarioIdFromLocalStorage!: number;
  mostrarMensaje: boolean = false;
  loader: boolean = false;
  messageInput: string = "";
  messageList: any[] = [];
  currentRoom: string = '';
  imagenes: string[] = [
    '../../../assets/perfiles/usuarios/imagenHombre1.png',
    '../../../assets/perfiles/usuarios/imagenMujer1.png',
    '../../../assets/perfiles/usuarios/imagenHombre2.png',
    '../../../assets/perfiles/usuarios/imagenMujer2.png',
    '../../../assets/perfiles/usuarios/imagenHombre3.png',
    '../../../assets/perfiles/usuarios/imagenMujer3.png',
  ];

  constructor(
    private usuarioService: UsuarioService, 
    private amistadService: AmistadService,
    private chatService: ChatService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.usuarioId = this.route.snapshot.params["id"];
    this.chatService.joinRoom(this.currentRoom);
    this.listenerMessage();
    const usuarioLocalStorage = localStorage.getItem('usuario');
    if (usuarioLocalStorage) {
      const usuarioAlmacenado = JSON.parse(usuarioLocalStorage);
      this.usuarioIdFromLocalStorage = usuarioAlmacenado.id;
      this.loadUsuarioSeguidos(this.usuarioIdFromLocalStorage);
    }

    setTimeout(() => {
      this.loader = true;
    }, 1500);
  }

  loadUsuarioSeguidos(id: number) {
    this.amistadService.findBySeguidor(id).subscribe(
      (amistadesSeguidos) => {
        this.amistadService.findBySeguido(id).subscribe(
          (amistadesSeguidores) => {
            const allAmistades = [...amistadesSeguidos, ...amistadesSeguidores];
            let userIds = new Set<number>();

            this.usuariosEnAmistad = [];
            for (let amistad of allAmistades) {
              if (amistad.idSeguidor === this.usuarioIdFromLocalStorage) {
                userIds.add(amistad.idSeguido);
              }
              if (amistad.idSeguido === this.usuarioIdFromLocalStorage) {
                userIds.add(amistad.idSeguidor);
              }
            }

            const usuariosObservables = Array.from(userIds).filter(userId => userId !== this.usuarioIdFromLocalStorage).map(userId => 
              this.usuarioService.getUsuarioById(userId)
            );

            forkJoin(usuariosObservables).subscribe(usuarios => {
              this.usuariosEnAmistad = usuarios;
              if (this.usuariosEnAmistad.length > 0) {
                this.selectUsuario(this.usuariosEnAmistad[0]);
              }
            });
          }
        );
      }
    );
  }

  selectUsuario(usuario: Usuario) {
    const otherUserId = usuario.id;
    this.currentRoom = this.generateRoomName(this.usuarioIdFromLocalStorage, otherUserId);
    this.chatService.joinRoom(this.currentRoom);
    this.messageList = [];
  }

  generateRoomName(userId1: number, userId2: number): string {
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  }

  sendMessage() {
    const chatMessage: ChatMessage = {
      message: this.messageInput,
      usuarioId: this.usuarioIdFromLocalStorage.toString()
    }
    this.chatService.sendMessage(this.currentRoom, chatMessage);
    this.messageInput = "";
  }

  listenerMessage() {
    this.chatService.getMessageSubject().subscribe(
      (messages: any[]) => {
        const messageObservables = messages.map((item: any) => 
          this.usuarioService.getUsuarioById(item.usuarioId)
            .pipe(map(usuario => ({ ...item, usuario })))
        );
  
        forkJoin(messageObservables).subscribe(
          (messagesWithUsers: any[]) => {
            this.messageList = messagesWithUsers.map((message: any) => ({
              ...message,
              message_side: message.usuario.id === this.usuarioIdFromLocalStorage ? 'sender' : 'reciever'
            }));
          },
          (error) => {
            console.error('Error al obtener los usuarios para los mensajes:', error);
          }
        );
      },
      (error) => {
        console.error('Error al recibir mensajes:', error);
      }
    );
  }
  
}
