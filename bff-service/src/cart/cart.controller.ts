import { All, Controller, Req, Res, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ProxyService } from 'src/proxy/proxy.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: ProxyService, private configService: ConfigService) {}

  @All()
  handleRequest(@Req() request: Request, @Res() response: Response): any {
    const urlParams = request.originalUrl.slice(1).split('/');
    const serviceName = urlParams[0];
    const serviceUrl = this.configService.get<string>(serviceName);

    if (!serviceUrl) {
      return {
        statusCode: HttpStatus.NOT_IMPLEMENTED,
        message: 'Cannot process request',
      };
    }

    const finalUrl = `${serviceUrl}/${urlParams.slice(1).join('/')}`;

    return this.cartService.handleRequest(finalUrl, request, response);
  }
}

