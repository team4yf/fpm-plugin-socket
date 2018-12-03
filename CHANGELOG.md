## 1.0.10 (2018-12-4)
Change:
- SocketServer
  - change `deviceOffline(socketClient, force = false)`
    
    Add `force` argument for it, it will not destory the connection if `force is false` and connection not be `destoryed` yet.
    
## 1.0.9 (2018-11-27)
Remove:
- `yarn.lock`

Change:
- SocketServer
  - Add `getClient(id)` Method
  - Add `addChannel(channel!String, ids!Array)` Method
    - this method returns the `addChannel` called by the online clients. 
  - Add an argument `ids` for `broadcast` Method
    - so, we can send message to the clients in the channels and in the ids.
  - Add `#socket/connect` Event
  
## 1.0.4 (2018-08-21)
Change:
- Promisefy the `send` method
  - Defined the `Callback` map
  - Resolve the callback on `data` event
  - The Encoder & Decoder method must parse the callback

## 1.0.3 (2018-08-11)
Add:
- `isOnline` method

Modify:
- change `clientId` to `id`
- change `socketServer.send(message, clientId)` to `socketServer.send(id, message)`
- handle callback for data send 

## 1.0.2 (2018-06-07)
Modify:
- Change `receive` Handler. `fpm.publish('#socket/receive', message)` the message include `id` & `data` fields

## 1.0.0 (2018-06-07)

Modify:
- Remove All Bind Function, Use Publish To Transform Data
- 

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
