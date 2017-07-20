import { Injectable } from '@angular/core';
import { Http, Response, Request } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Headers, RequestOptions } from '@angular/http'
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import 'rxjs/add/operator/map';
import {Jsonp} from '@angular/http';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1heWFuayBTZXRoaSIsImFwaSI6ImNpcmNsZSIsInNjb3BlcyI6WyJtYWlsYm94OmFsbCIsImNpcmNsZTphbGwiLCJmb2xsb3c6YWxsIl0sImlhdCI6MTQ5NzkzODEzOX0.cpLAt8BaYZyqyp53iDJGbl3yIBtBjj6_qoSiM4_hDiY';
let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
//  headers.append('Content-Type', 'application/json');
//  headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  headers.append('Authorization', `Bearer ${token}`);
//  headers.append('Accept', 'application/json')

let options = new RequestOptions({ headers: headers });

@Injectable()
export class ChatService {
private url = 'http://localhost:4000';  
private socket = io(this.url);;

constructor(private http: Http){}

authorize(){
  this.socket.emit('authorize', `Bearer ${token}`);
}
startListeningToMailbox(mid){
  this.socket.emit('startListeningToMailbox', {"mid":mid});
}
stopListeningToMailbox(mid){
  this.socket.emit('stopListeningToMailbox', {"mid":mid});
}

getMessages() {
  let observable = new Observable(observer => {
    this.socket.on('newActivity', (data) => {
      console.log(data.payload);
      observer.next(data);
    });
    return () => {
      this.socket.disconnect();
    };
  })
  return observable;
}
getAllActivities(user) {
  const url = `http://localhost:4000/mailbox/getallactivities/${user}`;
  return this.http.get(url).map((res) => {
    return res.json();
  })
}
}
