import { Client } from 'pg';
import { DBOptions } from './dbConfig.consts';
import { getInsertProductsQuery, getInsertStocksQuery } from '../../utils/queryBuilders';
import { TProduct, TProducts } from '../../types';

export class DBClient {
  client: Client;

  constructor(options = DBOptions, CustomClient = Client) {
    this.client = new CustomClient(options);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Database connection established successfully');
    } catch (err) {
      console.error('Failed to connect to the database! ', err);
    }
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('Disconnect from the database');
    } catch (err) {
      console.error('Failed to disconnect from the database! ', err);
    }
  }

  async checkIdDataExists(tableName: string) {
    const hasProducts = await this.client.query(`select exists(select 1 from ${tableName})`);
    return !!hasProducts.rows[0]?.exists;
  }

  async createTables() {
    try {
      await this.client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
      
      const productsCreated = await this.client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          title text not null,
          description text,
          price integer
        )
      `);

      if (!productsCreated) {
        throw new Error('Failed to create Products table!');
      } else if (productsCreated.rowCount > 0) {
        console.log('Products table successfully created');
      } else {
        console.log('Products table has been already created!');
      }
    
      const stocksCreated = await this.client.query(`
        CREATE TABLE IF NOT EXISTS stocks (
          stock_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
          product_id uuid,
          count integer,
          foreign key ("product_id") references "products" ("id")
        )
      `);
      if (!stocksCreated) {
        throw new Error('Failed to create Stocks table!');
      } else if (stocksCreated.rowCount > 0) {
        console.log('Stocks table successfully created');
      } else {
        console.log('Stocks table has been already created!');
      }

      } catch(err) {
        console.error(err);
      }    
  }

  async initDBData() {
    try {
      await this.createTables();

      const hasProducts = await this.checkIdDataExists('products');
      let productIds;
      if(!hasProducts) {
        const query = getInsertProductsQuery();
        await this.client.query(query);

        const { rows } = await this.client.query(`SELECT id FROM products`)
    
        if (!rows?.length) {
          throw new Error('Failed to insert into Products table!');
        } else  {
          console.log(`${rows.length} rows of Products table successfully inserted`);
        }
      }

      const hasStocks = await this.checkIdDataExists('stocks');
      if (!hasStocks && productIds) {
        const query = getInsertStocksQuery(productIds);
        const stocksInserted = await this.client.query(query);

        if (!stocksInserted) {
          throw new Error('Failed to insert into Stocks table!');
        } else  {
          console.log(`${stocksInserted.rowCount} rows of Stocks table successfully inserted`);
        }
      }
    } catch(err) {
      return err;
    }
  }

  async getAllProducts(): Promise<TProducts | string> {
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
      return 'Error with DB ' + JSON.stringify(err);
    }
  }

  async getProductById(id: string): Promise<TProduct | string> {
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
      return 'Error with DB ' + JSON.stringify(err);
    }
  }

  async createProduct({
    id,
    title,
    description,
    price,
    count
  }: TProduct): Promise<TProduct | string> {
    try {
      const productCreated = await this.client.query(`
        INSERT INTO products (id, title, description, price) VALUES
        ($1::uuid, $2::text, $3::text, $4::integer)
      `, [id, title, description, price]);

      if (!productCreated) {
        throw new Error('Failed to insert into Products table!');
      } else  {
        console.log(`${productCreated.rowCount} rows of Products table successfully inserted`);
      }

      const stocksCreated = await this.client.query(`
        INSERT INTO stocks (product_id, count) VALUES
        ($1::uuid, $2::integer)
      `, [id, count]);
      
      if (!stocksCreated) {
        throw new Error('Failed to insert into Stocks table!');
      } else  {
        console.log(`${stocksCreated.rowCount} rows of Stocks table successfully inserted`);
      }

      const { rows } = await this.client.query(`
        SELECT id, title, description, price, count FROM
        (
          SELECT * FROM products
          INNER JOIN stocks
          ON stocks.product_id = products.id
          WHERE id = $1::uuid
        ) beer
      `, [id]);

      console.log('The following product is created: ', rows);
      return rows;
    } catch (err) {
      console.error(err);
      return 'Error with DB ' + JSON.stringify(err);
    }
  }
}
