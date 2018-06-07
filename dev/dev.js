'use strict';
import { Fpm, Biz } from 'yf-fpm-server'
import plugin from '../src'
let app = new Fpm()

let biz = new Biz('0.0.1');
biz.addSubModules('foo',{})
app.addBizModules(biz);

const socketServer = plugin.bind(app)

// this plugin should run when INIT , but we cant run it in Dev Mode, so We should Run It Manually
app.runAction('INIT', app)

app.subscribe('#socket/receive', (topic, message) => {
	console.info(message)
})

app.run().then(() => {
	console.info('Ready To Go...')
})
