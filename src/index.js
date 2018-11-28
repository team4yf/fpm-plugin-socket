"use strict";
import _ from 'lodash'
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

    socketServer.bindConnectEvent((socketClient) => {
        // No device info, so we cannt use it todo anything.
        fpm.publish('#socket/connect', socketClient.toJson())
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
        const { message, channel, ids } = args;
        return socketServer.broadcast(message, channel, ids)
      },
      addChannel: async args => {
        return socketServer.addChannel(args.channel, args.ids);
      },
      send: async (args) => {
        try{
          const data = await socketServer.send(args.id, args.message, args.callback)
          return { data }
        }catch(e){
          return Promise.reject({ errno: -2001, message: e})
        }
      },
      isOnline: async args => {
        return _.has(socketServer._clients, args.id)? 1 : 0
      },
      getOnlineDevice: async (args) =>{
          const clients = _.values(socketServer._clients)
          const count = clients.length
          const limit = args.limit || 10
          const skip = args.skip || 0
          const rows = _.take(_.drop(clients, skip), limit)
          return { 
            data: {
              count, 
              rows: _.map(rows, (item) =>{
                return item.toJson()
              })
            }
          };
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


