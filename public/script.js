const videoGrid = document.getElementById('room-grid')

//
const socket = io("/")
var peer = new Peer(undefined,{
    host: "/",
    port: '3001'
}); 

const peers = {}

//
peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id)
})

//
const myVideo  = document.createElement('video');
myVideo.muted = true

//
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream=>{
    addVideoStream(myVideo,stream)

    peer.on('call',call=>{
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream',userVideoStream=>{
           addVideoStream(video,userVideoStream)
        })
    })
    //
    socket.on('user-connected',(userID) =>{
       connectToNewUser(userID,stream)
    })

})

//
socket.on('user-disconnected',userID=>{
    console.log("disconnected user: "+user)
    if(peers[userID]) peers[userID].close();
})

//
const connectToNewUser = (userID,stream) => {
  const call = peer.call(userID,stream)
  const video = document.createElement('video');

  //
  call.on('stream',(userVideoStream)=>{
    addVideoStream(video,userVideoStream)
  })

  call.on("close",()=>{
      video.remove()
  })

  peers[userID] = call
}

//
function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })

    videoGrid.append(video)
}