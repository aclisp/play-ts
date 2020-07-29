/* eslint-disable @typescript-eslint/no-var-requires */

const md4 = require('js-md4')

let v = '14fa98d4d74b189993c380c7b9e4d9d3' + 'yVvdcU4swiqsDtcoc87waK2edWC1MjgQUwRVjQ'
v = md4(v)
console.log(v)
