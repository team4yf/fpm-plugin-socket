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
	
	let data = _.dropRight(src, 2)
	data = Buffer.from(data, 'hex')

	let id = Buffer.from(_.take(data, 2), 'hex').toString('hex')
	console.info('setDataDecoder, get id:', id)
	return {id, data}
})
socketServer.setDataEncoder((src) => {
	return Buffer.from(src, 'hex')
})
// this plugin should run when INIT , but we cant run it in Dev Mode, so We should Run It Manually
app.runAction('INIT', app)

app.subscribe('#socket/receive', (topic, message) => {
	console.info('#socket/receive', message)
	socketServer.send(Buffer.from([0x02, 0x03, 0x04, 0x05, 0x21, 0x33], 'hex'), message.id)
})

app.subscribe('#socket/close', (topic, message) => {
	console.info('#socket/close', message)
})

app.run().then(() => {
	console.info('Ready To Go...')
})
