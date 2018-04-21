"use strict";
import _ from 'lodash'

const DEFAULT_TAG = 'UN_TAGED'
const DEFAULT_ALIAS = 'UN_ALIAS'
const DEFAULT_ID = -1


class SocketClient{
    constructor(client, id){
        this._id = id || DEFAULT_ID
        this._client = client || undefined
        if(client){
            this._ip = client.remoteAddress
            this._port = client.remotePort
        }        
        this._tag = DEFAULT_TAG
        this._alias = DEFAULT_ALIAS
        this._channel = []
        this._extendData = {}
    }

    isOnline(){
        return DEFAULT_ID !== this._id
    }

    getId(){
        return this._id
    }

    online(id){
        this._id = id
        return this
    }

    setAlias(alias){
        this._alias = alias
        return this
    }

    getAlias(){
        return this._alias
    }

    setTag(tag){
        this._tag = tag
        return this
    }
    
    getTag(){
        return this._tag
    }

    /**
     * add channel
     * @param {String/Array(String)} channel 
     * @desc
     * before:
     * Channels is ['DEFAULT']
     * when addChannel('AREA_1')
     * > Channels is ['DEFAULT', 'AREA_1']
     * when addChannel(['AREA_1', 'AREA_2'])
     * > Channels is ['DEFAULT', 'AREA_1', 'AREA_2']
     */
    addChannel(channel){
        if(_.isString(channel)){
            channel = [ channel ]
        }
        //ensure this array items unique
        this._channel = _.union( this._channel, channel)
        return this
    }

    getChannel(){
        return this._channel
    }

    /**
     * is InChannel
     * 
     * @param {String/Array(String)} channel 
     * @desc
     * before:
     * Channels is ['AREA_1']
     * when isInChannel('AREA_2') return false
     * when isInChannel('AREA_1') return true
     * when isInChannel(['AREA_1']) return true
     * when isInChannel(['AREA_1', 'AREA_2']) return true
     */
    isInChannel(channel){
        if(_.isString(channel)){
            channel = [ channel ]
        }
        for(let i in channel){
            let c = channel[i]
            if(this._channel.indexOf(c) > -1){
                return true
            }
        }
        return false        
    }


    addExtendData(data){
        const self = this
        _.map(data, (v, k) => {
            this._extendData[k] = v
        })
        return this
    }

    toJson(){
        return {
            id: this._id,
            ip: this._ip,
            port: this._port,
            channel: this._channel,
            tag: this._tag,
            alias: this._alias,
            extend: this._extendData
        }
    }

    getSocketClient(){
        return this._client
    }

    sendData(data){
        if(!this.isOnline()){
            return this
        }            
        // WARNING: Only Support JSON/String In Version 1.x.x
        if(_.isPlainObject(data)){
            data = JSON.stringify(data)
        }
        this._client.write(data)
        return this
    }
}

export { SocketClient }