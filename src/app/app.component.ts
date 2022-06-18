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
  photo: string = 'https://lh3.googleusercontent.com/nn3HPUmGPKLGfttQU1nl4zt1CM_MaigPuXHaFEa0xAZ5CipxgEhMCD9I650qC9Q_hy8_NfPQ_dF2Dh9OsLNWB3zwFuN1EOrbnymzrXxCK7-NvhA0xTYY9ep1R6SejQqlS4rLPhDHQromQKk_Osted93VUa33Ptbyzn9MrovzL8tk5hda5zZf-Y-PXWlX-cRUdfx_YkEs2dq9zkbIRzxNLJeyAjjnP3mnrIXE_2FZ-unVApdALb0vhR2_8jDMKsR4UJ06u_xICmX6eXT-TGaDVuvJuDGhrLCaX033uB_H64ZPaWirbgEJsEqelnJUWpXONQfTkcVg9OdHE9ULFqAXWbkgmj0F_qlYoMp_Qe0dvj_LYBrqEvF4kDZrTdDfZDDQAg8Fm3zK12kHxxGId_6DPV1_q2ecEWkVhVkKC2if21owi7O3Ow8Tk4KGnQVLgr9ojaRM4L1koiKGoQsw-_WifXQPiOxstX4ZxATtcah03apOqlRXUy_ZZ_cOWo6WDcbF8QUTADDDAncbu8Kc2UlnJOS9wv0yQ9QNplWn3LVa8JqGwdPxeV5aNHE_HpQU1l7TnahS30M_DXaKcpses7GzOaj3Qq3OZuLJwi6LuCAuSD2-3rEGkNC9eG-INCaqQ8FXhIH431WCLaQXtq8IWhJVZBU53q0Eg5wcEzd6wAI9OQYzQTY8H7o40udbwtHbmbIpH1qktyW86iqQkqAz5_gvmQ2R_1ErKASc2lNbQMKHoDkQYxs4p3bRSR9C2DaCkug=w690-h919-no?authuser=0'
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
    (await this.servise.getImage()).subscribe((data) => {this.photo = <string>data})
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
