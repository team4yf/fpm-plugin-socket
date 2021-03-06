'use strict';
const { Fpm, Biz } = require('yf-fpm-server');
const plugin = require('../src')
const _ = require('lodash');

let app = new Fpm()

let biz = new Biz('0.0.1');
biz.addSubModules('foo',{})
app.addBizModules(biz);

plugin.bind(app)
const socketServer = plugin.getServer()

socketServer.setDataDecoder((src) => {
	let hex = src
	
	let data = hex.slice(0, -2)
	let crc16 = hex.slice(-2)

	let id = data.toString('hex', 0, 2)
	let callback = data.toString('hex', 2, 4)
	
	if(callback === '0000'){
		return { id, data }
	}
	return {id, data, callback: callback}
})
socketServer.setDataEncoder((src) => {
	return Buffer.from(src, 'hex')
})
socketServer.setExtendFunction( src => {
	return src.toString('hex');
})
// this plugin should run when INIT , but we cant run it in Dev Mode, so We should Run It Manually
app.runAction('INIT', app)

app.subscribe('#socket/receive', (topic, message) => {
	console.info('#socket/receive', message)
	setTimeout( () => {
		socketServer.deviceOffline(socketServer.createClient(message.id));
	}, 2000)
})

app.subscribe('#socket/close', (topic, message) => {
	console.info('#socket/close', message)
	
})

app.subscribe('#socket/connect', (topic, message) => {
	console.info('#socket/connect', message)
})

app.run().then(() => {
	console.info('Ready To Go...')
})
