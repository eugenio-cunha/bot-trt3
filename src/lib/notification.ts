import { connect } from 'socket.io-client';
import { env, socketHost, socketPort } from '../config';

class Notification {

  private client: any;
  private environment: string;
  private static instance: Notification;

  private constructor(environment: string, host: string, port: string) {
    this.client = connect(`http://${host}:${port}`);
    this.environment = environment;
  }

  public static getInstance(environment: string, host: string, port: string): Notification {
    if (!Notification.instance) {
      Notification.instance = new Notification(environment, host, port);
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

export default Notification.getInstance(env, socketHost, socketPort);