import { Component,Input, OnInit } from '@angular/core';
import { Params, RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { RoleServices } from '../mailboxes/mailboxes.component.service';
import {JsonpModule} from '@angular/http';
@Component({
  selector: 'app-mailboxes',
  templateUrl: './mailboxes.component.html',
  styleUrls: ['./mailboxes.component.css'],
  providers: [RoleServices]
})
export class MailboxesComponent implements OnInit {
  resultArray=[];
  cid;
  constructor(private route: ActivatedRoute, private router: Router,private mail:RoleServices) { }

  ngOnInit() {
    this.cid=this.route.snapshot.params['cid'];
    console.log("aa", this.cid);
    this.mail.listRoles(this.cid).subscribe(res=> {this.resultArray=res});
    console.log(this.resultArray);
  }
}
