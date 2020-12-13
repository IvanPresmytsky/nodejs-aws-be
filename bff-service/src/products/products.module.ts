import { Module, CacheModule, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsController } from './products.controller';
import { ProxyService } from 'src/proxy/proxy.service';

const CACHE_TIMER = 120;

@Module({
  imports: [HttpModule, CacheModule.register({ ttl: CACHE_TIMER })],
  controllers: [ProductsController],
  providers: [ConfigService, ProxyService],
})

export class ProductsModule {};
