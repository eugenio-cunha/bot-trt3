import Bot from '../src/bot';
import { expect } from 'chai';
import { Mongo } from '../src/lib';
import { target } from '../src/config';

describe('API', function () {
  let bot: Bot;
  this.timeout(30000);

  before(done => {
    bot = new Bot(target);
    done();
  });

  it('solve() (done)', async (): Promise<void> => {
    const value = { id: '5ead7b9a23f6ab1714f417db',  code: '00108783320165030060', instance: 1 };
    await bot.solve(value);
    const { status } = await Mongo.find(target, 'request', value.id);
    expect(status).to.be.equal('done');
  });

  it('solve() (failed)', async (): Promise<void> => {
    const value = { id: '5ead7b9a23f6ab1714f417db',  code: '00108783320165030060', instance: 3 };
    await bot.solve(value);
    const { status } = await Mongo.find(target, 'request', value.id);
    expect(status).to.be.equal('failed');
  });
});