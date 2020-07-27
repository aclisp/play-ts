import Redis from 'ioredis'
import dotenv from 'dotenv'

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
}

class Histogram {
  buckets: Bucket[]
  constructor () {
    this.buckets = [
      { range: [0, 100], count: 0 },
      { range: [100, 200], count: 0 },
      { range: [200, 300], count: 0 },
      { range: [300, 400], count: 0 },
      { range: [400, 500], count: 0 },
      { range: [500, 600], count: 0 },
      { range: [600, 700], count: 0 },
      { range: [700, 800], count: 0 },
      { range: [800, 900], count: 0 }
    ]
  }

  count (x: number) {
    for (const b of this.buckets) {
      if (b.range[0] <= x && x < b.range[1]) {
        b.count++
      }
    }
  }

  print () {
    for (const b of this.buckets) {
      console.log(b)
    }
  }
}

async function processBlackList (redis: Redis.Redis) {
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
  for (const bl of allBlackList.slice(0, 20)) {
    console.log(bl)
  }
  const histo = new Histogram()
  for (const bl of allBlackList) {
    histo.count(bl.blackListCount)
  }
  histo.print()
}

dotenv.config();

(async function () {
  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST
  })
  await processBlackList(redis)
  await redis.quit()
})()
