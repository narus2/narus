import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { CV } from './cv';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RabotaService {
 
  constructor(private http: HttpClient) {
  }
 
  httpOptions = {
    headers: { 'Content-Type': 'application/json'
    ,'Authorization':''
    },
    withCredentials: true
  };

  private getUrl(path = "") {
    return "https://api.rabota.ua/".concat(path);
  }

  get_token() {
    const body = {
      username: "narus.od@gmail.com",
      phone: "",
      password: "Rfvbkjxrf",
      remember: false
    }

    return this.http.post<String>(this.getUrl("/account/login"), body, this.httpOptions )
  }
  async getCV(){
      return    this.get_token().pipe(switchMap(res => {
        this.httpOptions.headers.Authorization = 'Bearer ' + res;   
      return this.http.get(this.getUrl("resume/10932463?markView=true"),this.httpOptions)
      }))
    
  }
  

  async getPhoto() {
    return this.http.get(this.getUrl("account/photo"),this.httpOptions)
  }

}
