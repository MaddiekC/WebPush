import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GlobalService {

  APIUrl: string = 'https://localhost:7182/api';
  rutaJSON: string = 'assets/configfm2k.json';
  private configLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private http: HttpClient
  ) {
    //this.loadJson();
  }

  loadJson() {
    this.http.get(this.rutaJSON).toPromise()
      .then((data: any) => {
        this.APIUrl = data.APIUrl;

        //setea el observable con la propiedad next para indicar que se ha resolvido la peticion correctamente
        this.configLoaded$.next(true);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  getConfigLoadedObservable(): Observable<boolean> {
    return this.configLoaded$.asObservable();
  }

  getApiUrl(): string {
    return this.APIUrl;
  }

  saveSuscription(data: any): Observable<any> {
    console.log(this.APIUrl+'/Suscripcions')
    return this.http.post(this.APIUrl + '/Suscripcions', data)
  }

  receiveAlert(): Observable<any> {
    return this.http.get(this.APIUrl + '/Alertas')
  }

}