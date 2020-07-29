/* eslint-disable @typescript-eslint/no-var-requires */

const md2 = require('js-md2')

let v = '73.25'
for (let i = 0; i < 100000000; i++) {
  v = md2(v)
}
console.log(v)
