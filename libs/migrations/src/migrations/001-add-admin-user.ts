import { Db } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

export default async function (db: Db, connectionString?: string) {
  console.log('🚀 Running admin user migration...');
  if (connectionString) {
    console.log(`🔗 Connected with URI: ${connectionString}`);
  }

  const usersPath = path.join(__dirname, 'admin-users.json');
  const raw = fs.readFileSync(usersPath, 'utf-8');
  const users: { email: string; password: string }[] = JSON.parse(raw);

  for (const user of users) {
    const exists = await db.collection('userdocuments').findOne({ email: user.email });
    if (!exists) {
      const hashed = await bcrypt.hash(user.password, 10);
      await db.collection('userdocuments').insertOne({
        email: user.email,
        password: hashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Inserted user: ${user.email}`);
    } else {
      console.log(`ℹ️ User already exists: ${user.email}`);
    }
  }
}
