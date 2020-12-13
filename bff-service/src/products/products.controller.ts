import {
  All,
  CacheInterceptor,
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ProxyService } from 'src/proxy/proxy.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProxyService, private configService: ConfigService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  handleProducts(@Req() request: Request, @Res() response: Response): any {
    const serviceUrl = this.configService.get<string>('products');
    return this.productsService.handleRequest(serviceUrl, request, response);
  }

  @All()
  handleRequest(@Req() request: Request, @Res() response: Response): any {
    const urlParams = request.originalUrl.slice(1).split('/');
    const serviceName = urlParams[0];
    const serviceUrl = this.configService.get<string>(serviceName);

    if(!serviceUrl) {
      return {
        statusCode: HttpStatus.NOT_IMPLEMENTED,
        message: 'Cannot process request',
      };
    }

    const finalUrl = `${serviceUrl}/${urlParams.slice(1).join('/')}`;
    return this.productsService.handleRequest(finalUrl, request, response);
  }
}

