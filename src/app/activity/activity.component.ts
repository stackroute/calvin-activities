import { Component, OnChanges } from '@angular/core';
import { ChatService } from './activity.service';
import { Params, RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent {
  user;
  activities = [];
  messages = [];
  connection;
  last;


  constructor(private route: ActivatedRoute, private router: Router, private chatService: ChatService) { }
   get() {
    this.chatService.startListeningToMailbox(this.user);
    this.chatService.getAllActivities(this.user).subscribe(activity => {
      this.messages.push(activity);
    });
  }
  ngOnInit() {
    this.user =this.route.snapshot.params['mid'];
    this.chatService.authorize();
  }
  ngOnChanges(){
    this.connection = this.chatService.getMessages().subscribe(activities => {
      this.messages.unshift(activities);
    })
  }

  stop() {
    this.chatService.stopListeningToMailbox(this.user);
  }
  ngOnDestroy() {
    this.connection.unsubscribe();
  }
  // onscroll() {
  //   this.chatService.getAllActivities(this.mid, this  .last).subscribe(activity => {
  //     this.messages.push(activity);
  //   });
  // }
}