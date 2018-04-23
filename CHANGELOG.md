## 0.0.12 (2018-04-23)

Feature
  - change `send()` and `broadcast()` Return Promise
  - remove `Client.OnEnd` Event

## 0.0.10 (2018-04-21)

Feature

- Extend Api On `SocketServer`
  - `createClient(id)`

- Extend Api On `SocketClient`
  - `set/getTag`
  - `addChannel`
  - `getChannel`
  - `isInChannel(channel:String/String[])`
  - `set/getAlias`
  - `addExtendData(data:Object)`
  - `changeStatus(k, v)`
  - `getStatus(k)`

Change

- Change Receive Data.`channel` To Data.`event`

## 0.0.8 (2018-04-20)

Feature

- Add SocketClient Class


## 0.0.7 (2018-04-20)

Feature

- Add Api
 向fpm核心对象添加一个 `_socketServer` socket的服务端, `_socketClients` socket的客户端列表
  - `setDataDecoder(decoder) -> Src -> Object/String` 用于转换网络接收到的数据
  - `setDataEncoder(encoder) -> Src -> String` 用于转换网络发送的数据
  - `bindConnectEvent(fn)` 绑定客户端连接事件的函数
  - `bindTimeoutEvent(fn)` 绑定客户端超时事件的函数
  - `bindCloseEvent(fn)`   绑定客户端关闭事件的函数
  - `bindErrorEvent(fn)`   绑定客户端异常事件的函数
  - `bindReceiveEvent(fn)`  绑定接收到的数据处理函数
  - `broadcast(message, channel)`  广播消息,渠道可选
  - `send(message, clientId)` 给指定的客户端发送消息

- Add Depedent
  - `bluebird`

## 0.0.1 (2018-04-19)

Feature

- Socket Server 

Bugs

- Change `localhost` to `0.0.0.0` 
  Fix Remote Mode Cant Reach The Server .
- Add output Offline Client Id
