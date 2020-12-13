import { HttpModule, Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Module({
  imports: [HttpModule],
  providers: [ProxyService],
  exports: [ProxyService]
})
export class ProxyModule {}
