import { Component } from '@angular/core';
import { ChatService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  mid = 0;
  activities = [];
  messages = [];
  connection;


  constructor(private chatService:ChatService) {}
  get() {
    this.chatService.startListeningToMailbox(this.mid);
    this.chatService.getAllActivities(this.mid).subscribe( activity => {
      this.messages.push(activity);
    });
    this.connection = this.chatService.getMessages().subscribe(activity => {
      this.messages.unshift(activity);
    })
  }
 
  stop(){
    this.chatService.stopListeningToMailbox(this.mid);
  }
  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
