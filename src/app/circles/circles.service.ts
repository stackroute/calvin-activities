import { Injectable, Input } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { JsonpModule } from '@angular/http';
import { Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class circleService {
    @Input()
    allCircles = [];
    constructor(private _http: Http, private snackBar: MdSnackBar) { }
    getAllCircles() {
        const url = `http://localhost:4000/circle/getallcircles`;
        console.log('circle service url ', url);
        return this._http.get(url).map((res) => {
            return res.json();
        });
    }
}

