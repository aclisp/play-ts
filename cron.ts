import logger from './logger'

function sleep (ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function doWork () {
  logger.debug('start to do work')
  await sleep(2000)
  logger.debug('done work')
  setTimeout(doWork, 5000)
}

setTimeout(doWork, 5000)
