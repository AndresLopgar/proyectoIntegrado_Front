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
@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule],
  templateUrl: './mensaje.component.html',
  styleUrl: './mensaje.component.scss'
})
export class MensajesComponent implements OnInit{
  usuariosSeguidos!: Usuario[];
  amistadesBySeguidor!: Amistad[];
  usuarioId!: number;
  estaEnAmistad: boolean = false;
  usuarioIdFromLocalStorage!: number;
  mostrarMensaje: boolean = false;
  loader: boolean = false;
  messageInput : string = "";
  messageList: any[] = [];

  constructor (private usuarioService: UsuarioService, 
    private amistadService: AmistadService,
    private chatService: ChatService,
    private route: ActivatedRoute, ){}

  ngOnInit() {
    console.log(typeof this.chatService.joinRoom);
    this.usuarioId =this.route.snapshot.params["id"];
    this.chatService.joinRoom("ABC");
    this.listenerMessage();
      // Cargar el perfil del usuario utilizando el ID
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
  loadUsuarioSeguidos(id: number){
    this.amistadService.findBySeguidor(id).subscribe(
      (amistades) => {
        this.amistadesBySeguidor = amistades;

        if (this.amistadesBySeguidor.some(amistad => 
            amistad.idSeguidor === this.usuarioIdFromLocalStorage)) {
          this.estaEnAmistad = true;
        } else {
          this.estaEnAmistad = false;
        }

        this.usuariosSeguidos = [];
        let userIds = new Set<number>(); // Conjunto para almacenar los IDs de los usuarios ya agregados

        this.amistadService.getAllAmistades().subscribe(
          amistades =>{
            this.amistadesBySeguidor = amistades;
            for (let i = 0; i <  this.amistadesBySeguidor.length; i++) {
              if (!userIds.has(this.amistadesBySeguidor[i].idSeguido) && this.amistadesBySeguidor[i].idSeguido !== this.usuarioIdFromLocalStorage && this.amistadesBySeguidor[i].idSeguidor == this.usuarioIdFromLocalStorage) {
                this.usuarioService.getUsuarioById(this.amistadesBySeguidor[i].idSeguido).subscribe(
                    seguido => {
                        this.usuariosSeguidos.push(seguido);
                    });
                userIds.add(this.amistadesBySeguidor[i].idSeguido);
              }
            }
          })
      });
  }

  sendMessage(){
    const chatMessage : ChatMessage = {
      message: this.messageInput,
      usuarioId: this.usuarioId
    }
    this.chatService.sendMessage("ABC", chatMessage);
    this.messageInput = "";
  }

  listenerMessage(){
    this.chatService.getMessageSubject().subscribe((messages : any) =>{
      this.messageList = messages.map ((item: any) => ({
        ...item,
        message_side: item.usuarioId=== this.usuarioIdFromLocalStorage ?  'sender' : 'reciever'
      }));
    });
  }
}
