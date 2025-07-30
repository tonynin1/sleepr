import { Db } from 'mongodb';

export default async function (db: Db) {
  const result = await db.collection('reservationdocuments').updateMany(
    {
      timestamp: { $exists: false }
    },
    {
      $set: {
        timestamp: new Date(),
      }
    }
  );

  console.log(`✅ Updated ${result.modifiedCount} reservations with missing timestamp`);
}
