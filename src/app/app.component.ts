import { Component } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  messages = new Array({topic : 'mx1' , count : 92143 },{topic : 'mx2' , count : 12440 },{topic : 'mx3' , count : 92440 });  
  constructor() {
    const socket = io('localhost:3000');
    socket.on('msg', (value) => {
   // this.messages.push(value); 
    });
  }
}
