import dotenv from 'dotenv'
import Redis from 'ioredis'

class BlackList {
  uid: number
  blackListCount: number
  constructor (uid: number, count: number) {
    this.uid = uid
    this.blackListCount = count
  }
}

interface Bucket {
  count: number
  range: [number, number]
  uids: Set<number>
}

class Histogram {
  buckets: Bucket[]
  constructor () {
    function bucket (from: number, to: number): Bucket {
      return { range: [from, to], count: 0, uids: new Set() }
    }
    this.buckets = [
      bucket(0, 10),
      bucket(10, 20),
      bucket(20, 30),
      bucket(30, 40),
      bucket(40, 50),
      bucket(50, 60),
      bucket(60, 70),
      bucket(70, 80),
      bucket(80, 90),
      bucket(90, 100),
      bucket(100, 200),
      bucket(200, 300),
      bucket(300, 400),
      bucket(400, 500),
      bucket(500, 600),
      bucket(600, 700),
      bucket(700, 800),
      bucket(800, 900),
      bucket(900, 1000),
      bucket(1000, 2000),
      bucket(2000, Number.MAX_SAFE_INTEGER)
    ]
  }

  count (blackList: BlackList) {
    const x = blackList.blackListCount
    for (const b of this.buckets) {
      if (b.range[0] <= x && x < b.range[1]) {
        b.count++
        b.uids.add(blackList.uid)
      }
    }
  }

  print () {
    for (const b of this.buckets) {
      console.log(`range ${b.range} count: ${b.count}`)
    }
  }
}

async function processBlackList (redis: Redis.Redis): Promise<Histogram> {
  const allkeys = new Set<string>()
  const allBlackList: BlackList[] = []
  const blackListPrefix = 'hash:black:'
  const stream = redis.scanStream({
    match: blackListPrefix + '*'
  })
  for await (const chunk of stream) {
    const keys = chunk as string[]
    for (const x of keys) {
      allkeys.add(x)
    }
  }
  for (const x of allkeys) {
    const count = await redis.hlen(x)
    const uid = Number(x.slice(blackListPrefix.length))
    const blackList = new BlackList(uid, count)
    allBlackList.push(blackList)
  }
  allBlackList.sort((a, b) => {
    return b.blackListCount - a.blackListCount
  })
  console.log('--- TOP N ---')
  for (const bl of allBlackList.slice(0, 20)) {
    console.log(bl)
  }
  const histo = new Histogram()
  for (const bl of allBlackList) {
    histo.count(bl)
  }
  return histo
}

async function deleteBlackList (redis: Redis.Redis, histo: Histogram): Promise<void> {
  console.log('--- DIST ---')
  histo.print()

  let deleted = 0
  for (const bucket of histo.buckets) {
    if (bucket.range[0] >= 100) {
      for (const uid of bucket.uids) {
        if (process.env.DELETE_BLACKLIST === 'true') {
          await redis.del(`hash:black:${uid}`)
          deleted++
        }
      }
    }
  }
  console.log(`deleted ${deleted} keys`)
}

dotenv.config();

(async function () {
  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST
  })
  const master = new Redis({
    port: Number(process.env.REDIS_MASTER_PORT),
    host: process.env.REDIS_MASTER_HOST
  })

  const histo = await processBlackList(redis)
  await deleteBlackList(master, histo)

  await master.quit()
  await redis.quit()
})()
