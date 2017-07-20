import { Injectable, Input } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import { JsonpModule } from '@angular/http';
import { Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';


@Injectable()
export class loadService {
    @Input()
    allMsgs = [];

    constructor(private _http: Http, private snackBar: MdSnackBar) { }

    update() {

        const url = 'http://localhost:4000/load-test/load-test';
        console.log('circle service url ', url);
        return this._http.get(url).map((res) => {
            return res.json();
        });
    }
}