import { Component } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  constructor() {
    const socket = io('localhost:3000');
    socket.on('msg', (value) => {
      console.log('value:', value);
    });
  }
}
