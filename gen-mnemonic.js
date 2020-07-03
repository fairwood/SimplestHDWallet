const fs = require('fs')
const bn = require('bn.js')
const Mnemonic = require('bsv/lib/mnemonic/mnemonic') //引用“助记词”库

let txt = fs.readFileSync('...txt').toString()
let psw = fs.readFileSync('...txt').toString()

var n = new bn(txt, "hex")
var buf = n.toBuffer()
var mnstr = Mnemonic._entropy2mnemonic(buf, Mnemonic.Words.ENGLISH)
let mnemonic = Mnemonic.fromString(mnstr, Mnemonic.Words.ENGLISH)
let hd = mnemonic.toHDPrivateKey(psw)
console.log(mnemonic.toString())
for (let i = 0; i < 10; i++) {
    let path = "m/44'/0'/0'/0/" + i
    let hd0i = hd.deriveChild(path)
    let prikey0i = hd0i.privateKey //算出该层级的私钥
    console.log(path, prikey0i.toString(), prikey0i.toAddress().toString())
}