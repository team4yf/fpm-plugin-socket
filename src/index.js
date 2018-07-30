"use strict";
import _ from 'lodash'
import net from 'net'
import { SocketServer } from './SocketServer'

let socketServer

export default {
  getServer: () =>{
    return socketServer
  },
  bind: (fpm) => {   
    socketServer = new SocketServer()
    /**
     * bind events to socketServer
     */
    socketServer.bindReceiveEvent((message) => {
        fpm.publish('#socket/receive', message)
    })

    socketServer.bindConnectEvent((client) => {
        fpm.publish('#socket/connect', {})
    })

    socketServer.bindDecodeErrorEvent((message)=>{
        fpm.publish('#socket/decode/error', message)
    })

    socketServer.bindCloseEvent((socketClient) => {
        fpm.publish('#socket/close', socketClient.toJson())
    })

    socketServer.bindErrorEvent((error, socketClient ) => {
        fpm.publish('#socket/error', _.assign(socketClient.toJson(), { error }) )
    })

    const bizModule = {
      broadcast: async (args) =>{
          return socketServer.broadcast(args.message, args.channel)
      },
      send: async (args) => {
        return socketServer.send(args.message, args.clientId)
      },
      getOnlineDevice: async (args) =>{
          const clients = _.values(socketServer._clients)
          const count = clients.length
          const limit = args.limit || 10
          const skip = args.skip || 0
          const rows = _.take(_.drop(clients, skip), limit)
          return Promise.resolve({ 
            data: {
              count, 
              rows: _.map(rows, (item) =>{
                  return item.toJson()
              })
            }  
          });
      }
    }
    fpm.registerAction('BEFORE_SERVER_START', () => {
      fpm.extendModule('socket', bizModule) 
      const config = fpm.getConfig('socket') || {
        port: 5001,
        host: '0.0.0.0'
      }
      socketServer.start(config)
    })

    return bizModule
  }
}


