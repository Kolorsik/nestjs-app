import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connection } from 'mongoose';

let mongodb: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
    MongooseModule.forRootAsync({
        useFactory: async () => {
            mongodb = new MongoMemoryServer();
            const mongoUri = await mongodb.getUri();
            return {
                uri: mongoUri,
                ...options,
            };
        },
    });

export const clearDatabase = async () => {
    const collections = connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

export const closeInMongoConnection = async () => {
    if (mongodb) await mongodb.stop();
};
