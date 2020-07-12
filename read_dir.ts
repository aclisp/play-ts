import { promises as fs } from 'fs'
import * as path from 'path'

const targetDirectory = process.argv[2] || './'

class FileInfo {
  filePath: string
  fileSize: number
  constructor (path: string, size: number) {
    this.filePath = path
    this.fileSize = size
  }
}

async function readFile (filePath: string): Promise<FileInfo> {
  try {
    const data = await fs.readFile(filePath)
    return new FileInfo(filePath, data.length)
  } catch (err) {
    if (err.code === 'EISDIR') return new FileInfo(filePath, 0)
    throw err
  }
}

async function getFileLengths (dir: string): Promise<FileInfo[]> {
  const fileList = await fs.readdir(dir)

  const readFiles = fileList.map(async file => {
    const filePath = path.join(dir, file)
    return await readFile(filePath)
  })

  return await Promise.all(readFiles)
}

async function getFileLengthsV2 (dir: string): Promise<FileInfo[]> {
  const fileList = await fs.readdir(dir)

  const infos: FileInfo[] = []
  for (const file of fileList) {
    const filePath = path.join(dir, file)
    const fileInfo = await readFile(filePath)
    infos.push(fileInfo)
  }
  return infos
}

async function printLengths (dir: string, getFileLengths: (dir: string) => Promise<FileInfo[]>) {
  try {
    const results = await getFileLengths(dir)
    results.forEach(fileInfo => console.log(`${fileInfo.filePath}: ${fileInfo.fileSize}`))
    console.log('done!')
  } catch (err) {
    console.error(err)
  }
}

printLengths(targetDirectory, getFileLengths)
printLengths(targetDirectory, getFileLengthsV2)
