import * as fs from 'fs'
import { Transform } from 'stream'
import csv = require('csv-parser')

const YEAR_MS = 365 * 24 * 60 * 60 * 1000

fs.createReadStream('people.csv')
  .pipe(csv())
  .pipe(clean())
  .on('data', row => console.log(JSON.stringify(row)))

function clean (): Transform {
  return new Transform({
    objectMode: true,
    transform (row, encoding, callback) {
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
