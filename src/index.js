"use strict";
import _ from 'lodash'
import net from 'net'
import {SocketServer} from './SocketServer'

export default {
  bind: (fpm) => {
    console.log('start')
    fpm.registerAction('INIT', () => {
      
      const config = fpm.getConfig('socket') || {
        port: 5001,
        host: '0.0.0.0'
      }

      fpm._socketServer = new SocketServer(config)
    })
    
  }
}
