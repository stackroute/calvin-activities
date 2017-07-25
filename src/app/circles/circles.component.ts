import { Component, OnInit } from '@angular/core';
import { circleService } from './circles.service';

@Component({
  selector: 'app-circles',
  templateUrl: './circles.component.html',
  styleUrls: ['./circles.component.css'],
  providers: [circleService]
})
export class CirclesComponent implements OnInit {
  circleArray = [];
  constructor(private obj: circleService) { }

  ngOnInit() {
    this.obj.getAllCircles().subscribe(
      data => {
        this.obj.allCircles = data;
        this.circleArray = this.obj.allCircles;
        console.log('all circles data', this.circleArray);
      }, error => { return error },
      () => { return 'finished' }
    );
  }
}

