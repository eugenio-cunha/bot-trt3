import { socketUrl, env } from '../config';
import { connect } from 'socket.io-client';

class Notification {

  private client: any;
  private environment: string;
  private static instance: Notification;

  private constructor(environment: string, url: string) {
    this.client = connect(url);
    this.environment = environment;
  }

  public static getInstance(environment: string, url: string): Notification {
    if (!Notification.instance) {
      Notification.instance = new Notification(environment, url);
    }

    return Notification.instance;
  }

  public listen(target: string, callback: (value: { [key: string]: any }) => Promise<void>) {
    if (this.environment === 'production') {
      this.client.on(target, callback);
    } else {
      this.client.on(target, (message: any) => {
        console.info('request:', JSON.stringify(message));
        callback(message);
      });
    }
  }
}

export default Notification.getInstance(env, socketUrl);