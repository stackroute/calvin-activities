import { Injectable } from '@angular/core';
import { Http, Response, Request } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/map';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1heWFuayBTZXRoaSIsImFwaSI6ImNpcmNsZSIsInNjb3BlcyI6WyJtYWlsYm94OmFsbCIsImNpcmNsZTphbGwiLCJmb2xsb3c6YWxsIl0sImlhdCI6MTQ5NzkzODEzOX0.cpLAt8BaYZyqyp53iDJGbl3yIBtBjj6_qoSiM4_hDiY';
let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
//  headers.append('Content-Type', 'application/json');
//  headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  headers.append('Authorization', `Bearer ${this.token}`);
//  headers.append('Accept', 'application/json')

let options = new RequestOptions({ headers: headers });

@Injectable()
export class ChatService {
private url = 'http://localhost:3000';  
private socket = io(this.url);;

constructor(private http:Http){}

startListeningToMailbox(mid){
  this.socket.emit('startListeningToMailbox', mid);
}
stopListeningToMailbox(mid){
  console.log("Received stop !!");
  this.socket.emit('stopListeningToMailbox', mid);
}

getMessages() {
  console.log("inside get all messages");
  let observable = new Observable(observer => {
    this.socket.on('newActivity', (data) => {
      console.log(data);
      observer.next(data);
    });
    return () => {
      this.socket.disconnect();
    };
  })
  return observable;
}
getAllActivities(mid) {
  console.log("insude service");
  const url = `http://localhost:4000/mailbox/getallactivities/${mid}?limit=2`;
  return this.http.get(url)
    .map((response: Response) => response.json());
}
}
