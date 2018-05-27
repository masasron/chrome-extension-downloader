'use strict'

const crxParser = buff => {
    return new Promise((resolve, reject) => {
        if (buff.readUInt32LE(0) !== 0x34327243 /* Cr24 */) {
            return reject(new Error('Unexpected CRX magic number'));
        }

        if (buff.readUInt32LE(4) !== 2) {
            return reject(new Error('Unexpected CRX version'));
        }

        var publicKeyLength = buff.readUInt32LE(8);
        var signatureLength = buff.readUInt32LE(12);
        var metaOffset = 16;
        var publicKey = new Buffer(buff.slice(metaOffset,
            metaOffset + publicKeyLength)).toString('base64');
        var signature = new Buffer(buff.slice(metaOffset + publicKeyLength,
            metaOffset + publicKeyLength + signatureLength)).toString('base64');

        resolve({
            header: {
                publicKey: publicKey,
                signature: signature
            },
            body: buff.slice(metaOffset + publicKeyLength + signatureLength)
        })
    })
}

module.exports = crxParser