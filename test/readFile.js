'use strict'

const assert = require('assert')
const { readFile } = require('../src')

describe('Read file function', function () {
    it('should read without error', function (done) {
        this.timeout(10 * 1000)

        readFile({
            filename: 'manifest.json',
            extension_id: 'gighmmpiobklfepjocnamgkkbiglidom'
        }).then(buff => {
            done()
        }).catch(error => {
            done(error)
        })
    })

    it('should fail due to file not found error', function (done) {
        this.timeout(10 * 1000)

        readFile({
            filename: '???',
            extension_id: 'gighmmpiobklfepjocnamgkkbiglidom'
        }).then(buff => {
            done(new Error('Should fail!'))
        }).catch(error => {
            assert.equal(error.toString(), 'Error: The requested file was not found')
            done()
        })
    })

    it('should fail due to Unexpected CRX magic number exception', function (done) {
        this.timeout(10 * 1000)

        readFile({
            filename: 'manifest.json',
            extension_id: 'invalid'
        }).then(buff => {
            done(new Error('Should fail!'))
        }).catch(error => {
            assert.equal(error.toString(), 'Error: Unexpected CRX magic number')
            done()
        })
    })
})