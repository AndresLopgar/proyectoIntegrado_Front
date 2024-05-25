import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../model/chatMessage';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ChatService {
    private stompClient:any;
    private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

    //heroku
    //private baseUrl = 'https://artconnect-9bc127224463.herokuapp.com/chat-socket';

    //localhost
    private baseUrl = 'http://localhost:8081/chat-socket';

    constructor(private httpClient: HttpClient){
        this.initConnectionSocket();
    }

    initConnectionSocket(){
        const socket = new SockJS(this.baseUrl);
        this.stompClient = Stomp.over(socket);
    }

    joinRoom(roomId : string){
        this.stompClient.connect({}, ()=> {
            this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
                const messageContent = JSON.parse(messages.body);
                const currentMessages = this.messageSubject.getValue();
                currentMessages.push(messageContent);
                this.messageSubject.next(currentMessages);
            })
        })
        this.loadMessage(roomId);
    }

    sendMessage(roomId : string, chatMessage: ChatMessage){
        this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
        this.loadMessage(roomId);
    }

    getMessageSubject(){
        return this.messageSubject.asObservable();
    }

    loadMessage(roomId: String): void{
        this.httpClient.get<any[]>(`http://localhost:8081/api/chat/${roomId}`).pipe(
            map((result: { user_name: any; message: any; }[]) => {
                return result.map((res: { user_name: any; message: any; })=>{
                    return{
                        usuarioId: res.user_name,
                        message: res.message
                    } as ChatMessage
                })
            })
        ).subscribe({
            next: (chatMessage: ChatMessage[]) => {
                this.messageSubject.next(chatMessage);
            },
            error:(error) => {
                console.log(error);
            }
        })
    }
}