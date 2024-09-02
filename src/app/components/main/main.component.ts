import { Component, Injectable } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { MatButtonModule } from '@angular/material/button';
import { GlobalService } from '../../services/global.service';
import { SwPush } from '@angular/service-worker';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, MatButtonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {
  cookieService: any;

  anyThing: any;

  constructor(
    private swPush: SwPush, private auxService: GlobalService) { }

  ngOnInit() {
    this.requestNotificationPermise()
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('Notification click event:', { action, notification });

      if (action === 'explore' && notification.data?.url) { // Verifica que la URL esté presente
        window.open(notification.data.url, '_blank');
      } else {
        console.error('No URL found in notification data');
      }
    });
  
  }
 

  requestNotificationPermise() {
    //solicita autorizacion para mostrar notificaciones

    this.swPush.requestSubscription(
      {
        //serverPublicKey: this.globalService.configJSON.swKey
        serverPublicKey: "BHlTvNxZ8GH6GyNWxo_lOGGjwERRYgL1oyHzqSj9Ot7Aerxsl60wh_5MtdxKJeG8ld9vSd4LnLRJ1AglfqHBYtM"
      }

    ).then(

      (sub) => {

        console.log("Notificaciones permitidas");

        const subscriptionData = {

          endpoint: sub.endpoint,

          expirationTime: sub.expirationTime,

          keys: {

            p256dh: this.arrayBufferToBase64(sub.getKey("p256dh")!),

            auth: this.arrayBufferToBase64(sub.getKey("auth")!)

          }

        };

        //convertir en json y mostrar por consola

        console.log("JSON", JSON.stringify(subscriptionData));

        this.anyThing = JSON.stringify(subscriptionData);



        //almacenar la suscripcion en la base de datos

        const data = {

          //sudDate: new Date(),

          endpoint: subscriptionData.endpoint,

          //sudExpirationTime: subscriptionData.expirationTime,

          keyAuth: subscriptionData.keys.auth,

          keyP256dh: subscriptionData.keys.p256dh

          //sudEstado: 1

        }

        console.log(data)

        this.auxService.saveSuscription(data).subscribe(
          response => {
            console.log("Suscripcion guardada:", response);

          },
          error => {
            console.log("Error al guardar suscripcion:", error);
          }
        );


      }

    ).catch(

      (err: any) => {

        console.log("Notificaciones denegadas");

        console.log(err);

      }

    );

  }


  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binaryArray = new Uint8Array(buffer);
    const binaryString = String.fromCharCode(...binaryArray);
    return btoa(binaryString);
  }

}