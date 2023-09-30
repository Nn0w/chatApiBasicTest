import dotenv from 'dotenv';
// Parsing the env file.

dotenv.config({ path: '.env' });

interface ENV {
  PORT: number | undefined;
  DATABASE_URL: string | undefined;
}

interface Config {
  PORT: number;
  DATABASE_URL: string;
}

const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    DATABASE_URL: process.env.DATABASE_URL,
  };
};

// Throwing an Error if any field was undefined we don't
const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
