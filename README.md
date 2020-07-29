# 微信支付客户端API

## 配置文件

在根目录下创建`wechat.config.json`文件，格式如下：

```json
{
    "appid": "<appid>",
    "app_secret": "<app安全码>",
    "mch_id": "商户号",
    "mch_key": "商户秘钥",
    "body": "默认商品描述信息",
    "pay_notify_url": "支付成功通知地址",
    "refund_notify_url": "退款成功通知地址",
    "api_cert": "HTTPS证书路径",
    "term_ip": "终端IPv4地址"
}
```

## API列表

### 交易相关

- [统一下单](docs/modules/_main_.html#createtrade)
- [订单查询](docs/modules/_main_.html#querytrade)
- [关闭订单](docs/modules/_main_.html#closetrade)
- [发起退款](docs/modules/_main_.html#createrefund)
- [退款查询](docs/modules/_main_.html#queryrefund)
- [付款通知](docs/modules/_main_.html#onpaynotified)
- [退款通知](docs/modules/_main_.html#onrefundnotified)

### 对账单相关

- [下载所有交易数据](docs/modules/_main_.html#downloadallbill)
- [下载成功支付的交易数据](docs/modules/_main_.html#downloadsuccessbill)
- [下载所有退款交易数据](docs/modules/_main_.html#downloadrefundbill)
- [下载基本账户资金账单](docs/modules/_main_.html#downloadbasicfundflow)
- [下载手续费账户资金账单](docs/modules/_main_.html#downloadfeesfundflow)
- [下载运营账户资金账单](docs/modules/_main_.html#downloadoperationfundflow)