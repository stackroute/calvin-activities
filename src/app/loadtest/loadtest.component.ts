import { Component, OnInit } from '@angular/core';
import { loadService } from './loadtest.service';

@Component({
  selector: 'app-loadtest',
  templateUrl: './loadtest.component.html',
  styleUrls: ['./loadtest.component.css'],
 providers: [loadService]
})
export class LoadtestComponent implements OnInit {

 circleArray = [];
 constructor(private obj: loadService) { }

 ngOnInit() {
   this.obj. update().subscribe(
     data => { this.obj.allMsgs=data;
       this.circleArray = this.obj.allMsgs;
       console.log('all circles data' , this.circleArray);
     }, error => { return error},
     () =>{return 'finished'}
   );
 }
}