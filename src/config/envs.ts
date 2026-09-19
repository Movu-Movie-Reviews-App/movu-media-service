

import 'dotenv/config'
import Joi, * as joi from 'joi';


interface EnvVars {
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;

    NATS_SERVERS: string[];

    AWS_REGION: string;
    AWS_BUCKET_NAME: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;


}

const envsSchema = Joi.object({
    NATS_SERVERS: joi.array().items(joi.string()).single().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    AWS_REGION: joi.string().required(),
    AWS_BUCKET_NAME: joi.string().required(),
    AWS_ACCESS_KEY_ID: joi.string().required(),
    AWS_SECRET_ACCESS_KEY: joi.string().required()
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {
    natsServers: envVars.NATS_SERVERS,
    dbHost: envVars.DB_HOST,
    dbPort: envVars.DB_PORT,
    dbUsername: envVars.DB_USERNAME,
    dbPassword: envVars.DB_PASSWORD,
    dbName: envVars.DB_NAME,
    awsRegion: envVars.AWS_REGION,
    awsBucketName: envVars.AWS_BUCKET_NAME,
    awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: envVars.AWS_SECRET_ACCESS_KEY

}