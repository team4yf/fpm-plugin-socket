"use strict";
import _ from 'lodash'
import net from 'net'
import { SocketClient } from './SocketClient'
import Q from 'q'

const voidFunc = () =>{
    // do nothing here
}

class SocketServer{
    constructor(options){
        // -- define the options
        this._options = _.assign({
            timeout: 500 * 1000,
            host: '0.0.0.0',
            port: 5001,
        }, options)
        
        // -- the socket clients
        this._clients = {}

        // -- the user defined events
        this._events = {}

        // -- the callbacks for promise
        this._callbacks = {}
        // -- the data transform protocol
        this._encoder = (src) => {
            return src
        }
        this._decoder = (data) => {
            return { id: data.id || _.now(), data }
        }
    }

    // -- device online 
    deviceOnline(socketClient, id){
        // if this client reconnect, run connect event
        if(socketClient.isOnline()){
            return id;
        }
        socketClient.online(id)
        this._clients[ id ] = socketClient
        this.getEventHandler('connect')(socketClient);
        return id
    }

    // -- device offline
    deviceOffline(socketClient){
        if(socketClient.isOnline()){
            if(!_.has(this._clients, socketClient.getId())){
              return
            }
            delete this._clients[ socketClient.getId() ]
        }
    }

    createClient(id){
        return new SocketClient(undefined, id);
    }

    getClient(id){
        return _clients[id];
    }

    addChannel(channel, ids){
        let arr;
        if(_.isString(ids)){
            arr = ids.split(',');
        }else if(_.isArray(ids)){
            arr = ids;
        }
        return _.filter(arr, id => {
            const c = this._clients[id];
            if(c){
                c.addChannel(channel)
                return true;
            }
            return false;
        }).join(',')
    }

    /* Event Defined */

    bindEvent(eventName, fn){
        this._events[eventName] = fn
    }

    bindConnectEvent(fn){
        this.bindEvent('connect', fn)
    }

    bindTimeoutEvent(fn){
        this.bindEvent('timeout', fn)
    }

    bindCloseEvent(fn){
        this.bindEvent('close', fn)
    }

    bindErrorEvent(fn){
        this.bindEvent('error', fn)
    }

    bindDecodeErrorEvent(fn){
        this.bindEvent('decode.error', fn)
    }

    bindReceiveEvent(fn){
        this.bindEvent('receive', fn)
    }

    getEventHandler(eventName){
        return this._events[eventName] || voidFunc
    }

    setDataDecoder(fn){
        this._decoder = fn
    }

    setDataEncoder(fn){
        this._encoder = fn
    }

    setExtendFunction(fn){
        this._extendFunction = fn
    }

    /* Send Data */
    // this method should not make sure received
    broadcast(message, channel, ids){
        // do nothing when there is no client
        if(_.size(this._clients)<1){
            return 0;
        }
        const NOW = _.now()
        let data = this._encoder(message)
        let count = 0
        
        let idArr, channelArr;
        if( !ids ){
            idArr = [];
        }else if(_.isString(ids)){
            idArr = ids.split(',');
        }else if(_.isArray(ids)){
            idArr = ids;
        }

        if( _.isString(channel) ){
            channelArr = channel.split(',');
        }else if( _.isArray(channel) ){
            channelArr = channel;
        }
        
        if(!channelArr){
            // Send To All Clients
            _.map(this._clients, (client) => {
                client.sendData(data);
                count ++;
            })
        }else{
            _.map(this._clients, (client) => {
                if(client.isInChannel(channelArr)){
                    client.sendData(data);
                    count ++;
                }                
            })
        }
        _.map(idArr, id => {
            const c = this._clients[id];
            if(c){
                if(c.isInChannel(channelArr)){
                    // send in channel already
                    return;
                }
                c.sendData(data);
                count ++;
            }
        })
        return count
    }

    // -- * IMPORTANT: * this should be return promise include the device's return data
    send(id, message, callbackId){
        if(!_.has(this._clients, id)){
            return Promise.reject('offline')
        }
        const client = this._clients[id]
        let data = this._encoder(message)
        if(callbackId && callbackId != '0000'){
            const deferred = Q.defer()
            this._callbacks['' + callbackId] = deferred            
            
            client.sendData(data, (err) =>{
                if(err){
                    deferred.reject(err)
                }
            })
            return deferred.promise
        }
        return new Promise( (rs, rj) => {
            client.sendData(data, (err) =>{
                if(err){
                    rj(err)
                }else{
                    rs(1)
                }
            })
        })
    }

    /* Socket Start/Shutdown */

    connectionEvent(client){
        const self = this
        client.setTimeout(this._options.timeout)

        const socketClient = new SocketClient(client)

        // Receive Data From Client
        client.on('data', (data) => {
            // decode the network data
            let message = this._decoder(data)
            if(!message){
                return
            }
            
            self.deviceOnline(socketClient, message.id || _.now())
            if(message.callback){
                const callbackId = '' + message.callback
                if(_.has(this._callbacks, callbackId)){
                    if(_.isFunction(this._extendFunction)){
                        this._callbacks[callbackId].resolve(this._extendFunction(message.data))    
                    }else{
                        this._callbacks[callbackId].resolve(message.data)
                    }
                    delete this._callbacks[callbackId]
                }
                // return
            }
            // handle the message
            self.getEventHandler('receive')(message)
        })
    
        client.on('close', () =>{
            self.deviceOffline(socketClient)
            self.getEventHandler('close')(socketClient)
        })
    
        client.on('timeout', () =>{
            self.deviceOffline(socketClient)
            self.getEventHandler('timeout')(socketClient)
        })
    
        client.on('error', (error) =>{
            self.deviceOffline(socketClient)
            self.getEventHandler('error')(error, socketClient)
        })

    }

    init(){
        this._server.on('connection', this.connectionEvent.bind(this))
    }

    start(options){
        this._options = _.assign(this._options, options)
        this._server = net.createServer()
        this.init()
        const self = this
        return new Promise((rs, rj) => {
            self._server.listen(self._options.port, self._options.host, () => {
                rs(self._server.address());
            })
        })
        
    }

}

export { SocketServer }