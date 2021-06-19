import dotenvConfig from './dotenv.config';
dotenvConfig();

export default {
  EMAIL_SMTP_HOST: process.env.EMAIL_SMTP_HOST || '',
  EMAIL_SMTP_PORT: Number(process.env.EMAIL_SMTP_PORT) || 2015,
  EMAIL_SMTP_USER: process.env.EMAIL_SMTP_USER || '',
  EMAIL_SMTP_PASSWORD: process.env.EMAIL_SMTP_PASSWORD || '',
  EMAIL_SMTP_FROM: 'TESTE <naoresponda@psgtec.com.br>',
  JWT_SECRET: process.env.JWT_SECRET || ''
};
