import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
 messagesDelivered=0;
  ngOnInit() {
  }
  constructor(private router:Router,private route:ActivatedRoute) {
    const socket = io('localhost:3000');
    socket.on('msg', (data) => {
          
    if(data.messagesDelivered) {
        this.messagesDelivered = data.messagesDelivered;  
     }

   });
  }
}
