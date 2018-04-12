import { Component } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  privatePushs = [];
  publicPushs = [];
  constructor(private socket: SocketService) {
    this.socket.privatePush.subscribe(res => {
      this.privatePushs.unshift({ date: new Date(), data: res });
    });
    this.socket.publicPush.subscribe(res => {
      this.publicPushs.unshift({ date: new Date(), data: res });
    });
  }
}
