import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('PORT:', process.env.PORT);
    
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    const port = process.env.PORT || 3000;
    
    await app.listen(port, '0.0.0.0');

  } catch (error) {
console.error('❌ Error starting application:', error);
    process.exit(1);
  }
}

bootstrap().catch(error => {
console.error('❌ Fatal error:', error);
  process.exit(1);
});