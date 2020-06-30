const BSV = require('bsv')
const Mnemonic = require('bsv/lib/mnemonic/mnemonic')

let mnemonicWordsString = 'heavy nephew corn credit core short cash slogan own glue filter appear'

let mn = Mnemonic.fromString(mnemonicWordsString)

console.log(mn)

let hd = BSV.HDPrivateKey.fromSeed(mn.toSeed())

let hd00 = hd.deriveChild("m/0/0")

// let prk = new BSV.PrivateKey()
let prk = hd00.privateKey

console.log(prk)
console.log(prk.toAddress())