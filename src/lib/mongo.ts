import { mongodbUrl } from '../config';
import { Document } from '../interfaces';
import { connect, MongoClient, ObjectID } from 'mongodb';

/**
 * @class Mongo
 * @description Classe Singleton de conexão Mongo
 */
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

  /**
   * @description Obtem um instância singleton de conexção com Mongo
   *
   * @returns {Mongo} Cliente de conexão Mongo
   */
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

  /**
   * @description Insere um novo bloco na collection blockchain
   *
   * @param {String} database nome da base dados 
   * @param {String} collection nome da collection 
   * @param {Document} data documento
   *
   * @returns {Promise<string>} id do documento
   */
  public async insert(database: string, collection: string, document: Document): Promise<string> {
    const db = await this.getDB(database);
    const { insertedId } = await db.collection(collection).insertOne(document);

    return insertedId;
  }

  /**
   * @description Encontra um documento
   *
   * @param {String} database nome da base dados
   * @param {String} key nome da chave
   * @param {String} value valor da pesquisa
   *
   * @returns {Promise<Null | Document>} retorna um document ou vazio caso não exista
   */
  public async find(database: string, collection: string, id: string): Promise<any> {
    const db = await this.getDB(database);

    const result = await db.collection(collection).findOne(
      { _id: { $eq: new ObjectID(id) } }, { projection: { _id: 0 } }
    );

    return result || null;
  }

  /**
   * @description Executa uma agregação
   *
   * @param {String} database nome da base dados
   * @param {String} collection nome da coleção
   * @param {String} pipeline pipeline da agregação
   *
   * @returns {Promise<Null | Document>} retorna um document ou vazio caso não exista
   */
  public async aggregate(database: string, collection: string, pipeline: any[]): Promise<any> {
    const db = await this.getDB(database);

    const result = await db.collection(collection).aggregate(pipeline).toArray();

    return result || null;
  }

  public id(value: string): ObjectID {
    return new ObjectID(value);
  }
}

export default Mongo.getInstance();