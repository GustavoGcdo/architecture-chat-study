import App from './app';

async function bootstrap() {
  try {
    const application = new App();
    application.start();
  } catch (error) {
    console.log('[server]: Error to up application: ', error);
  }
}

bootstrap();
