import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

  ngOnInit() {
  }
  topics = {}
  topicsData = new Map();
  consumerGroups = {}
  
  constructor(private router:Router,private route:ActivatedRoute) {
    let avg = 0 ;
    const socket = io('localhost:3000');
    socket.on('msg', (data) => {
    const topic = JSON.parse(data).topic;
    const count = JSON.parse(data).count;
    const consumerGroup = JSON.parse(data).consumerGroup;    
    const consumerID = JSON.parse(data).consumerID;
    const fillRate = JSON.parse(data).F;    
    const drainRate = JSON.parse(data).D;    
    const errorRate = JSON.parse(data).E;
    const fillRateCapacity = JSON.parse(data).FC;    
    const drainRateCapacity = JSON.parse(data).DC;        
     if(!this.topics[topic]){ this.topics[topic]=[0,0,0,0,0,0,0,0,0,0]; }
     this.topics[topic].unshift(count);
     this.topics[topic].pop();
     
      this.topics[topic].forEach(element => {
        avg+=element;
      });
      avg/=10;
     this.topicsData.set(topic ,Math.round(avg));
      
      //  this.topicsData.set(topic ,calculateAVG(this.topicsData[topic]));
      //  if(!this.consumerGroups[consumerGroup]){
      //  if(!this.consumerGroups[consumerGroup]){ 
      //  this.consumerGroups[consumerGroup] = {
      //      consumerID ,
      //      "F" : [0,0,0,0,0,0,0,0,0,0],
      //      "D" : [0,0,0,0,0,0,0,0,0,0],
      //      "E" : [0,0,0,0,0,0,0,0,0,0],
      //      "FC" : 0,
      //      "DC" : 0,
         
      //  }
      //  }

      // }
      function calculateAVG(lastTenValues){ 
        let avg = 0;
        lastTenValues.forEach(element => {
          avg+=element;
        });
        return Math.round(avg/10); 
    }
    console.log(this.consumerGroups[consumerGroup].consumerID);
   });
  }
}

