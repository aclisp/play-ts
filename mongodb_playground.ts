// eslint-disable-next-line semi
import { Db, MongoClient } from 'mongodb';

// Connection URL
const url = 'mongodb://127.0.0.1:27017'

// Database Name
const dbName = 'myproject';

(async function () {
  const client = new MongoClient(url, { useUnifiedTopology: true })
  try {
    await client.connect()
    console.log('Connected successfully to server')

    const db = client.db(dbName)
    const insertedCount = await insertSampleDocuments(db)
    console.log(`insert samples: inserted ${insertedCount} records`)

    await query(db)

    const deletedCount = await clean(db)
    console.log(`clean: deleted ${deletedCount} records`)
  } catch (err) {
    console.log(err)
  }

  client.close()
})()

async function insertSampleDocuments (db: Db): Promise<number> {
  const result = await db.collection('geo_records').insertMany([
    { name: 'Apple', sex: 0, location: { coordinates: [-73.856077, 40.848447], type: 'Point' } },
    { name: 'Bar', sex: 0, location: { coordinates: [-84.2040813, 9.9986585], type: 'Point' } },
    { name: 'Cate', sex: 1, location: { coordinates: [-74.0259567, 40.6353674], type: 'Point' } },
    { name: 'Danti', sex: 1, location: { coordinates: [-48.9424, -16.3550032], type: 'Point' } },
    { name: 'Eric', sex: 0, location: { coordinates: [-91.5971285, 41.6823902], type: 'Point' } }
  ])
  await db.collection('geo_records').createIndex({ location: '2dsphere' })
  return result.insertedCount
}

async function clean (db: Db): Promise<number> {
  const result = await db.collection('geo_records').deleteMany({})
  return result.deletedCount ?? 0
}

async function query (db: Db): Promise<void> {
  const docs = await db.collection('geo_records').find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [-73.8786113, 40.8502883]
        }
      }
    },
    sex: 0
  }).toArray()
  const names = docs.map(x => x.name)
  console.log(`query: ${names}`)
}
