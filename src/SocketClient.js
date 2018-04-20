"use strict";
import _ from 'lodash'

class SocketClient{
    constructor(client, id){
        this._id = id || -1
        this._client = client
        this._ip = client.remoteAddress
        this._port = client.remotePort
    }

    isOnline(){
        return -1 !== this._id
    }

    getId(){
        return this._id
    }

    online(id){
        this._id = id
    }

    toJson(){
        return {
            id: this._id,
            ip: this._ip,
            port: this._port
        }
    }

    getSocketClient(){
        return this._client
    }

    sendData(data){
        if(_.isPlainObject(data)){
            data = JSON.stringify(data)
        }
        this._client.write(data)
    }
}

export { SocketClient }