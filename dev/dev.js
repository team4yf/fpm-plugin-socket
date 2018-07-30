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
	data = new Buffer(data, 'hex')

	let id = new Buffer(_.take(data, 2), 'hex').join('-')
	console.info(id)
	return {id, data}
})
// this plugin should run when INIT , but we cant run it in Dev Mode, so We should Run It Manually
app.runAction('INIT', app)

app.subscribe('#socket/receive', (topic, message) => {
	console.info('#socket/receive', message)
})

app.run().then(() => {
	console.info('Ready To Go...')
})
