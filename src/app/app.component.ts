import { Component } from '@angular/core';
import { Convert, Cv } from './CV';
import { RabotaService } from './rabota.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  cv!: Cv;
  skils: Array<string> = [];
  photo: string = '../../assets/img/Ava.jpg'
  constructor(private servise: RabotaService) { }

  title = 'cv-Nosenko'

   getUrlParameter(name = '', title= '') {

  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return name.replace(urlRegex, function(url) {
    url = url.normalize().replace("</p>", "").replace("</p>", "").replace("<p>","").replace("&nbsp;","")
    
    return '<a class="my-projects-link" href="'.concat(url).concat('">').concat(title).concat('</a>');
  })
  
  };

  async ngOnInit(){
  (await this.servise.getCV()).subscribe(
    (data) => {
      this.cv = data
      console.log(data)
      this.setSkils()
    }
  )
  }

  async get_photo(){
    // (await this.servise.getPhoto()).subscribe((data) => {this.photo = <string>data})
    // return this.photo
  }

  tupe(key: number ){
    let typeMap = new Map<number, string>([
      [1, "Linkedin"],
      [2, "Facebook"],
      [5, "Google"],
      [4, "Twitter"]
      
  ]);
    return typeMap.get(key)
  }

  setSkils() {
      if (this.cv) {
        this.cv.skill.text.split("<p>")
          .forEach(el => { 
            let text = el.replace("<p>", "").replace("</p>", "").replace("&nbsp;", "").replace("&nbsp;", '') 
            if (text.length !=0) {this.skils.push(text)}
           })
      }
  }
}
