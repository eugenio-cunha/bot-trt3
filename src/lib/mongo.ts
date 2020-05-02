import { mongodbUrl } from '../config';
import { Doc } from '../interfaces';
import { connect, MongoClient, ObjectID } from 'mongodb';

class Mongo {

  private url: string;
  private static instance: Mongo;
  private client: MongoClient | null;
  private handler: NodeJS.Timeout | null;

  private constructor(url: string) {
    this.url = url;
    this.client = null;
    this.handler = null;
  }

  public static getInstance(): Mongo {
    if (!Mongo.instance) {

      if (!mongodbUrl) {
        throw new Error('Um dos parâmetros de conexão do Mongo tem um valor inválido.');
      }

      Mongo.instance = new Mongo(mongodbUrl);
    }

    return Mongo.instance;
  }

  private async getDB(name: string) {
    if (!name || name === '') {
      throw new Error('O nome da base de dados da conexão com Mongo tem um valor inválido.');
    }

    if (!this.client) {
      const uri = this.url.split('${db}').join(name);
      this.client = await connect(uri, { useUnifiedTopology: true });
    }

    if (this.handler) clearTimeout(this.handler);

    this.handler = setTimeout(() => {
      if (this.client) {
        this.client.close();
        this.client = null;
      }
    }, 1000 * 60);

    const db = this.client.db(name);
    return { collection: (name: string) => db.collection(name) }
  }

  public async insert(database: string, collection: string, doc: Doc): Promise<string> {
    const db = await this.getDB(database);
    const { insertedId } = await db.collection(collection).insertOne(doc);

    return insertedId;
  }

  public async update(database: string, collection: string, query: { [key: string]: any }, doc: Doc): Promise<number> {
    const db = await this.getDB(database);
    const { modifiedCount } = await db.collection(collection).updateOne(query, { $set: doc });

    return modifiedCount;
  }

  public async find(database: string, collection: string, id: string): Promise<any> {
    const db = await this.getDB(database);

    const result = await db.collection(collection).findOne(
      { _id: { $eq: new ObjectID(id) } }, { projection: { _id: 0 } }
    );

    return result || null;
  }

  public async aggregate(database: string, collection: string, pipeline: any[]): Promise<any> {
    const db = await this.getDB(database);

    const result = await db.collection(collection).aggregate(pipeline).toArray();

    return result || null;
  }

  public objectId(value: string): ObjectID {
    return new ObjectID(value);
  }
}

export default Mongo.getInstance();