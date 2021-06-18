import dotenvConfig from './dotenv.config';
import emailConfig from './email.config';
dotenvConfig();

export default {
  ...emailConfig
};
