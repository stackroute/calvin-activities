import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ngOnInit() {
  }
  topics = {}
  topicsData = new Map();
  constructor(private router:Router,private route:ActivatedRoute) {
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
