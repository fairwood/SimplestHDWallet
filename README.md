# SimplestHDWallet
 
这是我的DIY HD钱包。遵循BIP0032、BIP0039、BIP0044

随机熵和盐密码都在外部文件里，而不在代码里。

如果要提币，遵循以下步骤：

1. 把两个文件放对位置；

1. 在withdraw-money.js里修改变量i，它是HD路径的最后一段；

1. 在withdraw-money.js里填写对应的提币地址，当前代码只支持全部提币；

1. 执行withdraw-money.js，即可完成提币。