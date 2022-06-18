import { HttpClient,  } from '@angular/common/http';
import { Injectable, } from '@angular/core';
import { Cv } from './CV';


@Injectable({
  providedIn: 'root'
})
export class RabotaService {
 
  constructor(private http: HttpClient) {
  }
 
  httpOptions = {
    headers: { 'Content-Type': 'application/json'
    },
    withCredentials: false
  };

  async getCV(){
      return this.http.get<Cv>("https://nosenko-cv-back.herokuapp.com/",this.httpOptions)
  }

}
