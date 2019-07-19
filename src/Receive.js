import React from 'react';
import Peer from 'peerjs';

export default class Receive extends React.Component{
    constructor (props){
        super(props);
        this.state={

        }
    }
    getInitialState = () => {
        /**
         * this if for testing the local system 
         */
        return {
          peer: new Peer('9912054784'),
          my_id: '9912054784',
          peer_id: '',
          initialized: false,
        }
    
        // This works for the online proctoring
        // return {
        //   peer = new Peer({
        //     host: 'yourwebsite.com', port: 3000, path: '/peerjs',
        //     debug: 3,
        //     config: {'iceServers': [
        //       { url: 'stun:stun1.l.google.com:19302' },
        //       { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
        //     ]}
        //   })
        // }
      }
    
    componentWillMount = async () => {
        await this.setState({...this.getInitialState()});
        this.state.peer.on('connection', connection=>{
          console.log("Someone Connected with connection ..." +connection);
          this.setState({conn:connection},()=>{
            this.state.conn.on('open',()=>{
              this.setState({connected:true});
              this.state.conn.on('data',this.onReceiveData);
            })
          })
        });
        
      }
      onReceiveData(data){
          console.log(data);
      }
      componentWillUnmount=()=>{
        this.state.peer.destroy();
      }
      render(){
          return<div>Hey This is render</div>
      }
}
