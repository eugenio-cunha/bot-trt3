import fetch from 'node-fetch';
import { accessToken } from '../config';

export default class Captcha {

  public static async solve(base64: string): Promise<string | null> {
    const id = await this.send(base64);
    if (!id) return null;

    const attempts = Array(10).fill(this.quest);
    for (const attempt of attempts) {
      const text = await attempt(id);
      if (text) {
        return text;
      }
      await this.delay(500);
    }
    return null;
  }

  private static async send(base64: string): Promise<string | null> {
    const body = {
      json: 1,
      body: base64,
      method: 'base64',
      key: accessToken
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    };
    const response = await fetch('https://2captcha.com/in.php', options);
    const { status, request } = await response.json();

    return status === 1 ? request : null;
  }

  private static async quest(id: string): Promise<string | null > {
    const params = `key=${accessToken}&action=get2&id=${id}&json=1`;
    const response = await fetch(`https://2captcha.com/res.php?${params}`);
    const { status, request } = await response.json();

    return status === 1 ? request : null;
  }

  private static delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}