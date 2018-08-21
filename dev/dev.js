'use strict';
import { Fpm, Biz } from 'yf-fpm-server'
import plugin from '../src'
import _ from 'lodash'

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
// this plugin should run when INIT , but we cant run it in Dev Mode, so We should Run It Manually
app.runAction('INIT', app)

app.subscribe('#socket/receive', (topic, message) => {
	console.info('#socket/receive', message)
})

app.subscribe('#socket/close', (topic, message) => {
	console.info('#socket/close', message)
})

app.run().then(() => {
	console.info('Ready To Go...')
})
