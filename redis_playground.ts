import Redis from 'ioredis'

class BlackList {
  uid: number
  blackListCount: number
  constructor (uid: number, count: number) {
    this.uid = uid
    this.blackListCount = count
  }
}

const redis = new Redis()
const allkeys = new Set<string>()
const allBlackList: BlackList[] = []
const blackListPrefix = 'hash:black:'
const stream = redis.scanStream({
  match: blackListPrefix + '*'
})
stream.on('data', function (keys: string[]) {
  for (const x of keys) {
    allkeys.add(x)
  }
})
stream.on('end', async function () {
  for (const x of allkeys) {
    const count = await redis.hlen(x)
    const uid = Number(x.slice(blackListPrefix.length))
    const blackList = new BlackList(uid, count)
    allBlackList.push(blackList)
  }

  allBlackList.sort((a, b) => {
    return b.blackListCount - a.blackListCount
  })

  for (const bl of allBlackList.slice(0, 2)) {
    console.log(bl)
  }
  console.log('all keys have been visited')
  redis.quit()
})
