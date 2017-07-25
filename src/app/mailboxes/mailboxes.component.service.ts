import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MdSnackBar } from '@angular/material';
import 'rxjs/Rx';
import { Jsonp } from '@angular/http';

@Injectable()
export class RoleServices {
    constructor(private _http: Http, private snackBar: MdSnackBar) { }
    listRoles(domainName) {
        const url = 'http://localhost:4000/mailbox/getfollowers/circle/' + domainName;
        console.log(domainName, "DOMAINNAME");
        return this._http.get(url).map(res => res.json());
    }
}