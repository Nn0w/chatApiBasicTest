import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });
// Loading process.env as ENV interface
const getConfig = () => {
    return {
        PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
        DATABASE_URL: process.env.MONGO_URI,
    };
};
// Throwing an Error if any field was undefined we don't
const getSanitzedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config;
};
const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);
export default sanitizedConfig;
