import { Component } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  producer = new Array({topic : 'multiplexer1' , count : 92143 },{topic : 'multiplexer2' , count : 12440 },{topic : 'multiplexer1' , count : 92440 });  
  consumer = new Array(
  {
   topicName : 'multiplexer',
   consumerGroup : 'monitor',
   avg :
   {
   drainRate : 322411,
   fillRate : 12621,
   errorRate : 25331
   },
   capacity : 120001
  },
  {
   topicName : 'multiplexer',
   consumerGroup : 'monitor',
   avg :
   {
   drainRate : 12214,
   fillRate : 12321,
   errorRate : 21313
   },
   capacity : 121100
  },
  {
   topicName : 'multiplexer',
   consumerGroup : 'monitor',
   avg :
   {
   drainRate : 1224,
   fillRate : 1212132,
   errorRate : 21333
   },
   capacity : 121112100
  },  
  
  );
  topics = new Set();
  consumerGroups = new Set();
  constructor() {
    let topicCount = 0 ;
    const socket = io('localhost:3000');
    socket.on('msg', (data) => {
    let newTopic = JSON.parse(data.value).topic;
    if(newTopic){
      if(this.topics.size == 0) { 
        this.topics.add(newTopic); 
        topicCount += 1; 
        var $newTopic = new Array();
        $newTopic.push(JSON.parse(data.value).count);
      }
      this.topics.forEach(topicName => {
        if(!(topicName == newTopic)) { 
          this.topics.add(newTopic); 
          topicCount += 1;
          var $newTopic = new Array();
       };
      });
      $newTopic.push(JSON.parse(data.value).count);
      // console.log(newTopic);
      // console.log(JSON.parse(data.value).count);
      // console.log($newTopic);
      // console.log(topicCount); 
    } 
  });

  function calculateAverage(arrayName){
    let sum = 0 ;
    arrayName.forEach(element => {
      sum += element;
    });
    return (sum/arrayName.length);
  }

}

}