import { Route } from '@angular/compiler/src/core';
import { environment } from './../environments/environment';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/interfaces';
import { Observable } from 'rxjs/Observable';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import 'rxjs/add/observable/from';

declare var Echo: any;

@Injectable()
export class SocketService implements CanActivate {
  private url: string = environment.socketUrl;
  private port: string = environment.socketPort;
  private echo: any;
  private id = 1;
  private bearer = 'saidydsyuaXY5i89dy6jd62e';
  public privatePush: Subject<any> = new Subject<any>();
  public publicPush: Subject<any> = new Subject<any>();

  public successConnect: Subject<boolean> = new Subject<boolean>();
  public connectTimer: any;
  public isConnected: boolean;

  constructor(private router: Router) {
    this.createSocet();
    this.SubscribePrivateChanel();
    this.subscribePublicChanel();

    this.successConnect.subscribe(e => {
      this.isConnected = e;
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (
      this.echo &&
      this.echo.connector &&
      this.echo.connector.socket.connected
    ) {
      return true;
    }

    return Observable.from(this.successConnect);
  }

  createSocet() {
    if (this.echo) {
      this.echo.connector.options.auth.headers['Authorization'] = this.bearer;
    } else {
      this.echo = new Echo({
        broadcaster: 'socket.io',
        host: this.url + this.port,
        auth: {
          headers: {
            Authorization: this.bearer,
          },
        },
      });
      console.log(this.echo);
    }
  }
  private subscribePublicChanel() {
    this.echo.channel('public-push').listen(
      'PublicPush',
      (data: any) => {
        console.log(data);
        this.publicPush.next(data);
      },
      err => {}
    );
  }
  private SubscribePrivateChanel() {
    this.UnsubscribePrivateChanel();
    console.log(123);
    const cahanel = 'user.' + this.id;
    this.echo.private(cahanel).listen(
      'UserPush',
      (data: any) => {
        console.log(data);
        this.privatePush.next(data);
      },
      err => {}
    );
  }

  private UnsubscribePrivateChanel() {
    if (this.echo && this.echo.connector && this.echo.connector.channels) {
      for (const key in this.echo.connector.channels) {
        if (key.indexOf('user.') != -1) {
          this.echo.leave(key);
        }
      }
    }
  }
}
