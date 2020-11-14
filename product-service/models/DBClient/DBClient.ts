import { Client } from 'pg';
import { DBOptions } from './dbConfig.consts';
import { getInsertProductsQuery, getInsertStocksQuery, messagesBuilder } from '../../utils';
import { TProduct, TProducts } from '../../types';

export class DBClient {
  client: Client;

  constructor(options = DBOptions, CustomClient = Client) {
    this.client = new CustomClient(options);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log(messagesBuilder.DBClient.connectionSucess());
    } catch (err) {
      console.error(messagesBuilder.DBClient.connectionFailed(err));
      throw new Error(messagesBuilder.DBClient.connectionFailed(err));
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log(messagesBuilder.DBClient.disconnectionSucess);
    } catch (err) {
      console.error(messagesBuilder.DBClient.disconnectionFailed(err));
      throw new Error(messagesBuilder.DBClient.disconnectionFailed(err));
    }
  }

  async checkIfDataExists(tableName: string) {
    const hasProducts = await this.client.query(`select exists(select 1 from ${tableName})`);
    return !!hasProducts.rows[0]?.exists;
  }

  async createTables() {
    try {
      await this.client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
      
      await this.client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          title text not null,
          description text,
          price integer
        )
      `);
  
      await this.client.query(`
        CREATE TABLE IF NOT EXISTS stocks (
          stock_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          product_id uuid,
          count integer,
          foreign key ("product_id") references "products" ("id")
        )
      `);

      } catch(err) {
        console.error(messagesBuilder.DBClient.tablesCreationFailed(err));
        throw new Error(messagesBuilder.DBClient.tablesCreationFailed(err));
      }    
  }

  async initDBData() {
    try {
      await this.createTables();

      const hasProducts = await this.checkIfDataExists('products');

      if (hasProducts) return;

      await this.client.query('BEGIN');
      const { rows: productIds } = await this.client.query(getInsertProductsQuery());

      if (!productIds) {
        throw new Error(messagesBuilder.DBClient.DBInitializationFailed('No products was created!'))
      }

      await this.client.query(getInsertStocksQuery(productIds));
      await this.client.query('COMMIT');
    } catch(err) {
      await this.client.query('ROLLBACK');
      console.error(messagesBuilder.DBClient.DBInitializationFailed(err));
      throw new Error(messagesBuilder.DBClient.DBInitializationFailed(err));
    }
  }

  async getAllProducts(): Promise<TProducts> {
    try {
      const { rows } = await this.client.query(`
        SELECT id, title, description, price, count FROM
        (
          SELECT * FROM products
          INNER JOIN stocks
          ON products.id = stocks.product_id
        ) beers
      `);
      return rows;
    } catch(err) {
      console.error(messagesBuilder.DBClient.generalError(err));
      throw new Error(messagesBuilder.DBClient.generalError(err));
    }
  }

  async getProductById(id: string): Promise<TProduct> {
    try {
      const { rows } = await this.client.query(`
        SELECT id, title, description, price, count FROM
        (
          SELECT * FROM products
          INNER JOIN stocks
          ON stocks.product_id = products.id
          WHERE id = $1::uuid
        ) beer
      `, [id]);

      return rows;
    } catch (err) {
      console.error(messagesBuilder.DBClient.generalError(err));
      throw new Error(messagesBuilder.DBClient.generalError(err));
    }
  }

  async createProduct({
    title,
    description,
    price,
    count
  }: TProduct): Promise<TProduct> {
    try {
      await this.client.query('BEGIN');
      const { rows } = await this.client.query(`
        INSERT INTO products (title, description, price) VALUES
        ($1::text, $2::text, $3::integer)
        RETURNING id
      `, [title, description, price]);

      const productId = rows[0].id

      await this.client.query(`
        INSERT INTO stocks (product_id, count) VALUES
        ($1::uuid, $2::integer)
      `, [productId, count]);
      
      const { rows: product } = await this.client.query(`
        SELECT id, title, description, price, count FROM
        (
          SELECT * FROM products
          INNER JOIN stocks
          ON stocks.product_id = products.id
          WHERE id = $1::uuid
        ) beer
      `, [productId]);
      await this.client.query('COMMIT');
      return product;
    } catch (err) {
      await this.client.query('ROLLBACK');
      console.error(messagesBuilder.DBClient.generalError(err));
      throw new Error(messagesBuilder.DBClient.generalError(err));
    }
  }
}
