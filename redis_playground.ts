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
  uids: Set<number>
}

class Histogram {
  buckets: Bucket[]
  constructor () {
    this.buckets = [
      { range: [0, 10], count: 0, uids: new Set() },
      { range: [10, 20], count: 0, uids: new Set() },
      { range: [20, 30], count: 0, uids: new Set() },
      { range: [30, 40], count: 0, uids: new Set() },
      { range: [40, 50], count: 0, uids: new Set() },
      { range: [50, 60], count: 0, uids: new Set() },
      { range: [60, 70], count: 0, uids: new Set() },
      { range: [70, 80], count: 0, uids: new Set() },
      { range: [80, 90], count: 0, uids: new Set() },
      { range: [90, 100], count: 0, uids: new Set() },
      { range: [100, 200], count: 0, uids: new Set() },
      { range: [200, 300], count: 0, uids: new Set() },
      { range: [300, 400], count: 0, uids: new Set() },
      { range: [400, 500], count: 0, uids: new Set() },
      { range: [500, 600], count: 0, uids: new Set() },
      { range: [600, 700], count: 0, uids: new Set() },
      { range: [700, 800], count: 0, uids: new Set() },
      { range: [800, 900], count: 0, uids: new Set() },
      { range: [900, 1000], count: 0, uids: new Set() },
      { range: [1000, 2000], count: 0, uids: new Set() },
      { range: [2000, Number.MAX_SAFE_INTEGER], count: 0, uids: new Set() }
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

function deleteBlackList (redis: Redis.Redis, histo: Histogram) {
  histo.print()
}

dotenv.config();

(async function () {
  const redis = new Redis({
    port: Number(process.env.REDIS_PORT),
    host: process.env.REDIS_HOST
  })
  const histo = await processBlackList(redis)
  deleteBlackList(redis, histo)
  await redis.quit()
})()
