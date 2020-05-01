import Bot from './bot';
import { target, env } from './config';

const bot = new Bot();

bot.listen(target, () => console.info(`(${env}) ${target}`));