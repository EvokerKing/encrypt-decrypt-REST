const { scrypt, randomFill, createCipheriv, scryptSync, createDecipheriv } = require('node:crypto')
const express = require('express')

var app = express()

app.get('/encryptunknown/:data', async function (req, res) {
    scrypt('passwordfinder', 'salt', 24, (err, key) => {
        if (err) throw err

        randomFill(new Uint8Array(16), (err) => {
            if (err) throw err

            const cipher = createCipheriv('aes-192-cbc', key, '78765929c6cd5b6f')

            let encrypted = ''
            cipher.setEncoding('hex')

            cipher.on('data', (chunk) => encrypted += chunk)
            cipher.on('end', () => {
                res.end(encrypted)
            })

            cipher.write(req.params.data)
            cipher.end()
        })
    })
})

app.get('/decryptunknown/:data', async function (req, res) {
    const decipher = createDecipheriv('aes-192-cbc', scryptSync('passwordfinder', 'salt', 24), '78765929c6cd5b6f')

    let decrypted = ''
    decipher.on('readable', () => {
        let chunk
        while (null !== (chunk = decipher.read())) {
            decrypted += chunk.toString('utf8')
        }
    })
    decipher.on('end', () => {
        res.end(decrypted)
    })

    const encrypted =
        '250a4a79790ef4aa82b6cb4a95c93480'
    decipher.write(encrypted, 'hex')
    decipher.end()
})

var server = app.listen(8000, function () {
    console.log(`Listening at http://localhost:8000/`)
})