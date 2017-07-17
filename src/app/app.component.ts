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
  fillRate = new Array();
  drainRate = new Array();
  errorRate = new Array();
  
  constructor() {
  //   const socket = io('localhost:3000');
  //   socket.on('msg', (value) => {
  //   let res = checkIfTopicExists(value.topic)
  //   if(res) { addTopic(value.topic); }
  //   console.log(res);
  // });
  
  this.producer.forEach(element => {
    if(element.topic){
    if(this.topics.size == 0) { new Array(element.topic); this.topics.add(element.topic) }
    let flag = true;
    this.topics.forEach(topicName => {
      if(topicName == element.topic) { flag = false; } ;
    });
    if(flag) { new Array(element.topic); this.topics.add(element.topic); }
    }  
  });

  function checkIfTopicExists(topicName){
     this.topics.forEach(element => {
       if(topicName.equals(element)) { return true;  }
       return false;
     });
   }

   function addConsumerGroup(consumerGroupName){
     this.consumerGroups.add(consumerGroupName);
   }

   function checkIfCGExists(consumerGroupName){
     this.consumerGroups.forEach(element => {
       if(consumerGroupName.equals(element)) { return true;  }
       return false;
     });
   }

  function checkArrayLength(arrayName){
    if (arrayName.length <10){ return "push" }
    return arrayName+":"+arrayName.length;
  }


  function addAvg(currentFillRate){
    this.fillRate.push(currentFillRate);
  }

  function removeAvg(currentErrorRate){
    this.errorRate.pop(currentErrorRate);
  }

  function calculateAverage(arrayName){
    let sum = 0 ;
    arrayName.forEach(element => {
      sum += element;
    });
    return (sum/arrayName.length);
  }

}

}
