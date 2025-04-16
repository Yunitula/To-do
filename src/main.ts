import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseTransformInterceptor } from 'src/interceptors/response.transform.interceptor';
import { AppConfigService } from 'src/config/api-config.service';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const getConstraintMessage = (obj: any) => {
    if (obj.constraints) {
      return Object.values(obj.constraints)[0];
    } else if (obj.children && obj.children.length > 0) {
      return getConstraintMessage(obj.children[0]);
    } else {
      return 'Nested Validation error';
    }
  };

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      exceptionFactory: (errors) => {
        console.log(JSON.stringify(errors))
        const result = errors.map((error) => {
          const msg =
          Array.isArray(error.children) && error.children.length > 0
              ? getConstraintMessage(error.children[0])
              : Object.values(error.constraints || {})[0] || 'Validation error';
          return {
            property: error.property,
            message: msg,
          };
        });
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.enableCors();

  const apiConfigService = app.get(AppConfigService);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { docExpansion: 'none', persistAuthorization: true },
    customCss: '.swagger-ui .topbar {display: none}',
    customSiteTitle: apiConfigService.getValue('API_TITLE'),
  };

  const options = new DocumentBuilder()
    .setTitle(apiConfigService.getValue('API_TITLE'))
    .setDescription(apiConfigService.getValue('API_DESCRIPTION'))
    .setVersion(apiConfigService.getValue('API_VERSION'))
    .addBearerAuth()
    .addServer(
      `${apiConfigService.getValue('HOST')}:${apiConfigService.getValue('PORT')}`,
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document, customOptions);
  console.log(
    `App started in ${apiConfigService.getValue('HOST')}:${apiConfigService.getValue('PORT')}`,
  );

  await app.listen(apiConfigService.getValue('PORT'));
}
bootstrap();
