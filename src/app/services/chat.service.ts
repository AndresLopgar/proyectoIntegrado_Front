import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../model/chatMessage';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ChatService {
    private stompClient:any;
    private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);

    //heroku
    //private baseUrl = 'wss://artconnect-9bc127224463.herokuapp.com/chat-socket';

    //localhost
    private baseUrl = 'http://localhost:8081/chat-socket';

    constructor(){
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
    }

    sendMessage(roomId : string, chatMessage: ChatMessage){
        this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
    }

    getMessageSubject(){
        return this.messageSubject.asObservable();
    }
}