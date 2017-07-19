import { Component } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  topics = {}
  topicsData = new Map();
  myTopics = new Array();
  constructor() {
    let avg = 0 ;
    const socket = io('localhost:3000');
    socket.on('msg', (data) => {
    const topic = JSON.parse(data).topic;
    const count = JSON.parse(data).count;
     if(!this.topics[topic]){ this.topics[topic]=[0,0,0,0,0,0,0,0,0,0]; }
     this.topics[topic].unshift(count);
     this.topics[topic].pop();
     this.topics[topic].forEach(element => {
       
     });
     this.topics[topic].forEach(element => {
       avg+=element;
     });
     avg/=10;
     this.topicsData.set(topic ,Math.round(avg));
     
   });


}

}