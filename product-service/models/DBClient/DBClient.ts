import { Client } from 'pg';
import { DBOptions } from './dbConfig.consts';

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
      if(!hasProducts) {
        const productsInserted = await this.client.query(`
          INSERT INTO products (id, title, description, price) VALUES
          ('506ddef5-d329-411b-a14a-f8c71b9f2a03', 'IPA', 'British IPA', 5),
          ('b24e5533-de91-4f2b-be6d-897f47e19f2c', 'IPA', 'West Coast IPA', 4),
          ('c8e55fa4-5edb-48f2-997c-6d0b8da01b5c', 'IPA', 'New England Style IPA', 6)
        `);
    
        if (!productsInserted) {
          throw new Error('Failed to insert into Products table!');
        } else  {
          console.log(`${productsInserted.rowCount} rows of Products table successfully inserted`);
        }
        console.log('PRODUCTS_INSERTED: ', productsInserted);
      }

      const hasStocks = await this.checkIdDataExists('stocks');
      if (!hasStocks) {
        const stocksInserted = await this.client.query(`
          INSERT INTO stocks (product_id, count) VALUES
          ('506ddef5-d329-411b-a14a-f8c71b9f2a03', 101),
          ('b24e5533-de91-4f2b-be6d-897f47e19f2c', 105),
          ('c8e55fa4-5edb-48f2-997c-6d0b8da01b5c', 15)
        `);
        if (!stocksInserted) {
          throw new Error('Failed to insert into Stocks table!');
        } else  {
          console.log(`${stocksInserted.rowCount} rows of Stocks table successfully inserted`);
        }
        console.log('STOCKS_INSERTED: ', stocksInserted);
      }
    } catch(err) {
      return err;
    }
  }

  async getAllProducts() {
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

  async getProductById(id: string) {
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

  async createProduct({ id, title, description, price, count }: any) {
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
