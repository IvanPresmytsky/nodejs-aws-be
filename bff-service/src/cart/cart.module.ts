import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartController } from './cart.controller';
import { ProxyService } from 'src/proxy/proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [CartController],
  providers: [ConfigService, ProxyService],
})
export class CartModule {}
