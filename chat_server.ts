import { EventEmitter } from 'events'
import * as fs from 'fs'
import express from 'express'

const chatEmitter = new EventEmitter()
const port = process.env.PORT || 1337

const app = express()

app.get('/', respondText)
app.get('/json', respondJson)
app.get('/echo', respondEcho)
app.get('/static/*', respondStatic)
app.get('/chat', respondChat)
app.get('/sse', respondSSE)

app.listen(port, () => console.log(`Server listening on port ${port}`))

function respondText (req: express.Request, res: express.Response) {
  res.setHeader('Context-Type', 'text/plain')
  res.end('hi')
}

function respondJson (req: express.Request, res: express.Response) {
  res.json({ text: 'hi', numbers: [1, 2, 3] })
}

function respondEcho (req: express.Request, res: express.Response) {
  const { input = '' } = req.query
  const inputAsString = input as string

  res.json({
    normal: inputAsString,
    shouty: inputAsString.toUpperCase(),
    characterCount: inputAsString.length,
    backwards: inputAsString
      .split('')
      .reverse()
      .join('')
  })
}

function respondStatic (req: express.Request, res: express.Response) {
  const filename = `${__dirname}/public/${req.params[0]}`
  fs.createReadStream(filename)
    .on('error', () => respondNotFound(req, res))
    .pipe(res)
}

function respondChat (req: express.Request, res: express.Response) {
  const { message } = req.query

  chatEmitter.emit('message', message)
  res.end()
}

function respondSSE (req: express.Request, res: express.Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive'
  })

  const onMessage = (msg: string) => res.write(`data: ${msg}\n\n`)
  chatEmitter.on('message', onMessage)

  res.on('close', function () {
    chatEmitter.off('message', onMessage)
  })
}

function respondNotFound (req: express.Request, res: express.Response) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
}
