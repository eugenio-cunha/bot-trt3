import Bot from './bot';
import { target, env } from './config';

const bot = new Bot(target);

bot.listen(() => console.info(`(${env}) ${target}`));