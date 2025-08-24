import { MongoClient } from 'mongodb';
import * as path from 'path';
import * as fs from 'fs';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';

// Tạo một module tạm chỉ để load config
@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    providers: [ConfigService],
})
class MigrationConfigModule { }

async function runMigrations() {
    // Bootstrap Nest app để lấy ConfigService
    const app = await NestFactory.createApplicationContext(MigrationConfigModule);
    const configService = app.get(ConfigService);

    const MONGODB_URI = configService.get<string>('MONGODB_URI', 'mongodb://mongo:27018/sleepr');

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(); // Mặc định lấy database trong URI


    // Load và chạy các migration file
    const migrationsPath = path.join(__dirname, 'migrations');
    const files = fs
        .readdirSync(migrationsPath)
        .filter(f => f.endsWith('.ts') || f.endsWith('.js'))
        .sort();

    for (const file of files) {
        const migration = await import(path.join(migrationsPath, file));
        if (typeof migration.default === 'function') {
            console.log(`🔁 Running migration: ${file}`);
            await migration.default(db, MONGODB_URI);
        }
    }

    await client.close();
    await app.close(); // Đóng context sau khi xong
}

runMigrations().catch(err => {
    console.error('❌ Migration failed', err);
    process.exit(1);
});
