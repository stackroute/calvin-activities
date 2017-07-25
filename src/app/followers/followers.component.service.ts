import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class FollowerService {

 constructor(private http: Http,) { }

listCircles(mailboxId) {
 const url = 'http://localhost:4000/mailboxes/' + mailboxId;
 return this.http.get(url).map(res => res.json());
}
listNoOfMessages(mailboxId){
    const url = 'http://localhost:4000/mailbox/getallactivities/' + mailboxId;
    return this.http.get(url).map(res => res.json());

}
} 