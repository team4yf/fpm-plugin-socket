# fpm-plugin-socket

用于socket通信的插件

## Basic Info
- Run Action Hook Name: `BEFORE_SERVER_START`
- ExtendModule Name: `socket`
- Exception
  - [x] Nope
- `getDependencies()`
  - [x] `[]`
- The Reference Of The `Bind()` Method
  An BizModule Object Contains 3 Functions
  - [ ] `broadcast`
  - [ ] `send`
  - [ ] `getOnlineDevice`

## Usage
- Broadcast message

  `fpm.execute('socket.broadcast', message!Object) => Promise`
  - it always return a resolved Promise with the counter of success broadcast messages

- Send message to The client

  `fpm.execute('socket.send', message!Object) => Promise`
  - it always return a resolved Promise with the counter of success broadcast messages

- getOnlineDevice

  `fpm.execute('socket.getOnlineDevice', message!Object) => Promise`
  - it returns the online devices

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