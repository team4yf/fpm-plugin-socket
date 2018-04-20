'use strict';
import { Fpm, Biz } from 'yf-fpm-server'
import plugin from '../src'
let app = new Fpm()
plugin.bind(app)
let biz = new Biz('0.0.1');
biz.addSubModules('test',{
	foo:async function(args){
		return new Promise( (resolve, reject) => {
			reject({errno: -3001});
		});
	}
})
app.addBizModules(biz);

// this plugin should run when INIT , but we cant run it in Dev Mode, so We should Run It Manually
app.runAction('INIT', app)
const socketServer = app._socketServer

socketServer.bindReceiveEvent((message) => {
	console.log(message)
})

socketServer.start().then((message) => {
	console.log(message)
	setInterval(()=>{
		socketServer.send({message: 'hi One!'}, 1)
		socketServer.broadcast({message: 'hello'})
	}, 2000)
})





app.run()
