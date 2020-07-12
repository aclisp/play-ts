import * as fs from 'fs'
import { Transform, TransformCallback } from 'stream'
import csv = require('csv-parser')

const YEAR_MS = 365 * 24 * 60 * 60 * 1000

fs.createReadStream('people.csv')
  .pipe(csv())
  .pipe(clean())
  .on('data', (row: Record<string, unknown>) => console.log(JSON.stringify(row)))

function clean (): Transform {
  return new Transform({
    objectMode: true,
    transform (row: Record<string, string>, encoding: BufferEncoding, callback: TransformCallback) {
      const [firstName, lastName] = row.name.split(' ')
      const age = Math.floor((Date.now() - new Date(row.dob).getTime()) / YEAR_MS)
      callback(null, {
        firstName,
        lastName,
        age
      })
    }
  })
}
