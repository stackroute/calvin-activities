import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  messagesDelivered=0;
  ngOnInit() {
  }
  topics = {}
  topicsData = new Map();
  consumerGroups = {} ;
  consumerGroupsData = new Map();
  consumers = {} ; 
  consumersData = new Map();
  consumerGroupMapping = {} ;
  constructor(private router:Router,private route:ActivatedRoute) {
    let avg = 0 ;

    const socket = io('localhost:3000');
    socket.on('msg', (data) => {
     if(data.messagesDelivered) {
        this.messagesDelivered = data.messagesDelivered;  
     }

     if(JSON.parse(data).topicName) {
      const topic = JSON.parse(data).topicName;
      const count = JSON.parse(data).topicCount;       
      
     if(!this.topics[topic]){ this.topics[topic]=[0,0,0,0,0,0,0,0,0,0]; }
     this.topics[topic].unshift(count);
     this.topics[topic].pop();
     this.topicsData.set(topic ,calculateAVG(this.topics[topic]));
    }
    
    if(JSON.parse(data).consumerGroup) {
     
     const consumerGroup = JSON.parse(data).consumerGroup;    
     const consumerID = JSON.parse(data).consumerID;
     const fillRate = JSON.parse(data).F;    
     const drainRate = JSON.parse(data).D;    
     const errorRate = JSON.parse(data).E;
     const fillRateCapacity = JSON.parse(data).FC;    
     const drainRateCapacity = JSON.parse(data).DC;
     
     if(!this.consumerGroupMapping[consumerGroup]){ this.consumerGroupMapping[consumerGroup]=[consumerID] } 
      this.consumerGroupMapping[consumerGroup].push(consumerID);
      
      if(!this.consumerGroups[consumerGroup]){
      this.consumerGroups[consumerGroup] = {
        "F" : [0,0,0,0,0,0,0,0,0,0],
        "D" : [0,0,0,0,0,0,0,0,0,0],
        "E" : [0,0,0,0,0,0,0,0,0,0],
      }
      }


      if(!this.consumers[consumerID]){ 
        this.consumers[consumerID] = { 
          "F" : [0,0,0,0,0,0,0,0,0,0],
          "D" : [0,0,0,0,0,0,0,0,0,0],
          "E" : [0,0,0,0,0,0,0,0,0,0], 
          "FC" : 0,
          "DC" : 0,
        } 
       }

       this.consumers[consumerID].F.unshift(fillRate);
       this.consumers[consumerID].F.pop(fillRate);
       this.consumers[consumerID].D.unshift(drainRate);
       this.consumers[consumerID].D.pop(drainRate);
       this.consumers[consumerID].E.unshift(errorRate);
       this.consumers[consumerID].E.pop(errorRate);
       this.consumers[consumerID].FC = fillRateCapacity;
       this.consumers[consumerID].DC = drainRateCapacity;

       this.consumersData.set(consumerID,{
         "F" : calculateAVG(this.consumers[consumerID].F) ,
         "D" : calculateAVG(this.consumers[consumerID].D) ,
         "E" : calculateAVG(this.consumers[consumerID].E) ,
         "FC" : this.consumers[consumerID].FC ,
         "DC" : this.consumers[consumerID].DC ,
       });

       this.consumerGroups[consumerGroup].F.unshift(calculateAVG(this.consumers[consumerID].F));
       this.consumerGroups[consumerGroup].F.pop(calculateAVG(this.consumers[consumerID].F));
       this.consumerGroups[consumerGroup].D.unshift(calculateAVG(this.consumers[consumerID].D));
       this.consumerGroups[consumerGroup].D.pop(calculateAVG(this.consumers[consumerID].D));
       this.consumerGroups[consumerGroup].E.unshift(calculateAVG(this.consumers[consumerID].E));
       this.consumerGroups[consumerGroup].E.pop(calculateAVG(this.consumers[consumerID].E));

       this.consumerGroupsData.set(consumerGroup,{
         "F" : calculateAVG(this.consumerGroups[consumerGroup].F),
         "D" : calculateAVG(this.consumerGroups[consumerGroup].D),
         "E" : calculateAVG(this.consumerGroups[consumerGroup].E),
       });
      
       }
      
      function calculateAVG(lastTenValues){ 
        let avg = 0;
        lastTenValues.forEach(element => {
          avg+=element;
        });
        return Math.round(avg/10); 
    }
   });
  }
}

