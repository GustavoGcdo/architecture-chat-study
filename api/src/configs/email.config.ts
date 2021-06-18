const emailConfig = {
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  user: process.env.EMAIL_SMTP_USER,
  password: process.env.EMAIL_SMTP_PASSWORD,
  from: 'TESTE <naoresponda@psgtec.com.br>'
};

export default emailConfig;
