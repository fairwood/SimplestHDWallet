const fs = require('fs')
const bn = require('bn.js')
const Mnemonic = require('bsv/lib/mnemonic/mnemonic') //引用“助记词”库
const BSV = require('bsv') //引用bsv库
const MatterCloud = require('mattercloudjs') //引用MatterCloud库

let txt = fs.readFileSync('...txt').toString()
let psw = fs.readFileSync('...txt').toString()

let i = 9

var n = new bn(txt, "hex")
var buf = n.toBuffer()
var mnstr = Mnemonic._entropy2mnemonic(buf, Mnemonic.Words.ENGLISH)
let mnemonic = Mnemonic.fromString(mnstr, Mnemonic.Words.ENGLISH)
let hd = mnemonic.toHDPrivateKey(psw)
console.log(mnemonic.toString())

let path = "m/44'/0'/0'/0/" + i
let hd0i = hd.deriveChild(path)
let prikey0i = hd0i.privateKey //算出该层级的私钥
console.log(path, prikey0i.toAddress().toString())

let receiverAddresss = "1dDquE7NBvT1Rbyk5YUudmo6MTkveaSUn" //收款地址

const MatterCloudAPIKey = "CeJg9E1uuVJueBoJg6fkD5f5u7jBv4k7jj4cr6mmo8UTMzuqbq8Muzp3aXYTZ6bTh" //MatterCloud API Key
const matterAPI = MatterCloud.instance({
    api_key: MatterCloudAPIKey, 
})

async function main() {

    let priKey = prikey0i //组装私钥
    let address = priKey.toAddress() //获取自己钱包的地址

    //获取锁定在钱包地址上的所有UTXO
    await matterAPI.getUtxos(address).then(async utxos => {

        let newTx = new BSV.Transaction() //创建一个transaction

        newTx.feePerKb(500) //设置手续费率 ### Sat/Byte。 FIXME: 最终得到的tx的手续费和这里设置的不一致，原因不明
        //不同服务商的费率不同，经测试MatterCloud的广播API至少要 0.5 Sat/Byte。

        //将所有UTXO全部填入transaction的输入端（这是一种无脑做法，优秀的钱包应该智能地选择UTXO）
        let inputs = []
        utxos.forEach(utxo => {
            inputs.push(utxo)
        });
        newTx.from(inputs)

        newTx.change(receiverAddresss) //全部提走

        newTx.sign(priKey) //用私钥给transaction签署

        //生成16进制的transaction原数据，并输出，你可以用其他服务商来广播transaction
        let rawTx = newTx.toBuffer().toString('hex')
        console.log('RawTx:')
        console.log(rawTx)

        //用MatterCloud服务商广播transaction
        await matterAPI.sendRawTx(rawTx).then(res => {

            console.log('发送transaction成功:')
            console.log(res) //输出广播transaction的结果，包含txid

        }).catch(e => {
            console.error(e)
        })
    })
}

main()