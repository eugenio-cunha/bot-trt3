import { socketUrl } from '../config';
import { connect } from 'socket.io-client';

class Notification {

  private client: any;
  private static instance: Notification;

  private constructor(url: string) {
    this.client = connect(url);
  }

  public static getInstance(url: string): Notification {
    if (!Notification.instance) {
      Notification.instance = new Notification(url);
    }

    return Notification.instance;
  }

  public listen(target: string, callback: (value: { [key: string]: any }) => Promise<void>) {
    this.client.on(target, callback);
  }
}

export default Notification.getInstance(socketUrl);