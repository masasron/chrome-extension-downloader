'use strict'

const unzip = require('unzip')
const request = require('request')
const crxParser = require('./crxParser')
const { PassThrough } = require('stream')

const crxDownload = id => {
    const buff = []
    const stream = new PassThrough()
    const url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=49.0&x=id%3D${id}%26installsource%3Dondemand%26uc`

    return new Promise((resolve, reject) => {
        stream.on('data', data => buff.push(data))
        stream.on('error', error => reject(error))
        stream.on('finish', () => resolve(Buffer.concat(buff)))
        request(url).pipe(stream)
    })
}

const crxUnzip = crxBuffer => {
    return new Promise((resolve, reject) => {
        crxParser(crxBuffer).then(result => {
            const stream = new PassThrough()
            stream.end(result.body)
            resolve(stream.pipe(unzip.Parse()))
        }).catch(reject)
    })
}

const readEntry = entry => {
    return new Promise((resolve, reject) => {
        const buff = []
        const stream = new PassThrough()

        stream.on('data', data => {
            buff.push(data)
        })

        stream.on('finish', data => {
            resolve(Buffer.concat(buff))
        })

        stream.on('error', reject)

        entry.pipe(stream)
    })
}

const readFile = ({ extension_id, filename }) => {
    return new Promise((resolve, reject) => {
        crxDownload(extension_id).then(buffer => {
            crxUnzip(buffer).then(stream => {
                let found = false

                stream.on('entry', async entry => {
                    if (entry.path === filename) {
                        found = true
                        resolve(await readEntry(entry))
                    }
                })
                    .on('error', reject)
                    .on('close', () => found === false ? reject(new Error('The requested file was not found')) : null)
            }).catch(reject)
        }).catch(reject)
    })
}

module.exports = {
    readFile,
    crxUnzip,
    readEntry,
    crxParser,
    crxDownload
}