import { Component, OnInit } from '@angular/core';
import {FollowerService} from '../followers/followers.component.service';
import { Params, RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css'],
  
})
export class FollowersComponent implements OnInit {

resultArray=[];
count;

  constructor(private route: ActivatedRoute,private follower:FollowerService) { }

  ngOnInit() {
    this.follower.listCircles(this.route.snapshot.params['mid']).subscribe(res=> this.resultArray=res);
    this.follower.listNoOfMessages(this.route.snapshot.params['mid']).subscribe(res => this.count=res); 
  }

}
