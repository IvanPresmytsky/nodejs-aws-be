import { Method } from 'axios';
import { TProducts } from '../types';

export enum ECacheFields {
  Products = 'products'
};

export type TCachedDataTypes = TProducts;

export type TCacheType = {
  products: {
    data: TProducts;
    isCached: boolean;
    methods: Method[];
  }
};

export class CacheService {
  cache: TCacheType;

  timer: number;

  constructor(cacheTimer = 0) {
    this.timer = cacheTimer;
    this.cache = {
      products: {
        data: [],
        isCached: false,
        methods: ['GET'],
      },
    }
  }

  private getCache(cacheField: ECacheFields) {
    return this.cache[cacheField].data;
  }

  private getIsCached(cacheField: ECacheFields) {
    return this.cache[cacheField].isCached;
  }

  private setCache(cacheField: ECacheFields, data: TCachedDataTypes) {
    this.cache[cacheField].data = data;
    this.cache[cacheField].isCached = true;

    setTimeout(() => {
      this.cache[cacheField].isCached = false;
      console.log(`Caching for ${cacheField} was switched off`);
    }, this.timer);
  }

  private cacheData(cacheField: ECacheFields, data: TCachedDataTypes) {
    if (!this.cache[cacheField]) {
      throw new Error(`Field ${cacheField} doesn't presented in CacheService!`)
    }

    if (this.getIsCached(cacheField)) {
      return this.getCache(cacheField);
    }

    this.setCache(cacheField, data);

    return data;
  }

  checkForCached(cacheField: ECacheFields, method: Method, data: TCachedDataTypes) {
    if (!this.cache[cacheField]) {
      throw new Error(`Field ${cacheField} doesn't presented in CacheService!`);
    }

    if (this.cache[cacheField].methods.includes(method)) {
      return this.cacheData(cacheField, data)
    }

    return data;
  }
}