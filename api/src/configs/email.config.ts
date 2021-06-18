const emailConfig = {
  from: 'TESTE <naoresponda@psgtec.com.br>',
  host: process.env.EMAIL_SMTP_HOST,
  port: Number(process.env.EMAIL_SMTP_PORT),
  user: process.env.EMAIL_SMTP_USER,
  password: process.env.EMAIL_SMTP_PASSWORD
};

export default emailConfig;
