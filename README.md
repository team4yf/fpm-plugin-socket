# fpm-plugin-socket

A plugin for Socket, It's only for a few datas( Normally < 20 bytes ). 

We use it to build IOT project.

Transform with byte array like hex.

~Support `CRC16` data compare.~


## Basic Info
- Run Action Hook Name: `BEFORE_SERVER_START`
- ExtendModule Name: `socket`
- Exception
  - [x] Nope
- `getDependencies()`
  - [x] `[]`
- The Reference Of The `Bind()` Method
  An BizModule Object Contains those Functions
  - [ ] `broadcast`
  - [ ] `send`
  - [ ] `getOnlineDevice`
  - [ ] `isOnline`

## Usage
- SetEncoder/SetDecoder

  - setDataDecoder
    it must be return a Object{id, data}, and some crc16 compare, return `undefined` if crc16 error
    
    ```javascript
    socketServer.setDataDecoder((src) => {
      // the last 2 bytes is the crc16 data
      let data = _.dropRight(src, 2)
      data = Buffer.from(data, 'hex')

      let id = Buffer.from(_.take(data, 2), 'hex').toString('hex')
      return {id, data}
    })
    ```
  - setDataEncoder
    
    Make sure return an Buffer Object

- Broadcast message

  `fpm.execute('socket.broadcast', message!Object, channel?Array) => Promise`
  - it always return a resolved Promise with the counter of success broadcast messages

- Send message to The client

  `fpm.execute('socket.send', id!String, message!HexString) => Promise`
  - it return an reject if send error

- getOnlineDevice

  `fpm.execute('socket.getOnlineDevice', message!Object) => Promise`
  - it returns the online devices

- isOnline

  `fpm.execute('socket.isOnline', id!String) => Promise`
  - it returns device which use the id is online

- Subscribe Event To Receive Message 
  - [ ] `##socket/receive`
    ```javascript
	fpm.subscribe('#socket/receive', (topic, message) => {
		console.info(message)
	})
	```
  - [ ] `#socket/connect`
    ```javascript
	fpm.subscribe('#socket/connect', (topic) => {
		console.info(topic)
	})
	```
  - [ ] `#socket/decode/error`
    ```javascript
	fpm.subscribe('#socket/decode/error', (topic, data) => {
		console.info(data)
	})
	```
  - [ ] `#socket/close`
    ```javascript
	fpm.subscribe('#socket/close', (topic, client) => {
		console.info(client)
	})
	```
  - [ ] `#socket/error`
    ```javascript
	fpm.subscribe('#socket/error', (topic, error) => {
		console.info(error)
	})
	``` 