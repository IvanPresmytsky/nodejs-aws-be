import { Method } from 'axios';
import { StatusCodes } from 'http-status-codes';

import { TProducts } from '../types';
import { runProxy } from '../utils';

export enum ECacheFields {
  Products = 'products'
};

export type TCachedDataTypes = TProducts;

export type TCacheType = {
  products: {
    GET: {
      data: TProducts;
      isCached: boolean;
      status: StatusCodes | null;
      url: string;
    }
  }
};

export class CacheService {
  private cache: TCacheType;

  private timer: number;

  constructor(cacheTimer = 0) {
    this.timer = cacheTimer;
    this.cache = {
      products: {
        GET: {
          data: [],
          isCached: false,
          status: null,
          url: '',
        }
      },
    }
  }

  private clearCache(cacheField: ECacheFields, method: Method) {
    this.cache[cacheField][method] = {
      isCached: false,
      status: null,
      url: '',
      data: [],
    }
  }

  private setCache(
    cacheField: ECacheFields,
    url: string,
    method: Method,
    data: TCachedDataTypes,
    status: StatusCodes
  ) {
    if (!this.cache[cacheField]?.[method]) {
      return;
    }

    this.cache[cacheField][method] = {
      isCached: true,
      status,
      url,
      data,
    };

    setTimeout(() => {
      this.clearCache(cacheField, method);
      console.log(`Caching for ${cacheField} for method ${method} was switched off`);
    }, this.timer);
  }

  private isCached(cacheField: ECacheFields, url: string, method: Method) {
    return this.cache[cacheField]?.[method]
      && this.cache[cacheField][method].url === url
      && this.cache[cacheField][method].isCached;
  }

  async runCachedProxy(cacheField: ECacheFields, url: string, method: Method, body: any) {
    const isCached = this.isCached(cacheField, url, method);
    if (isCached) {
      console.log('Sending cached data...');
      return {
        status: this.cache[cacheField][method].status,
        data: this.cache[cacheField][method].data,
      }
    }

    const { status, data } = await runProxy(url, method as Method, body);

    this.setCache(cacheField, url, method, data, status);

    return { status, data };
  }
}
