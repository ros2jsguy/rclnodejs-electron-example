const {ipcRenderer} = window.require('electron')

let msgCnt = 0

ipcRenderer.on("rosmsg",(e, msg) => {
    document.getElementById("messages").innerHTML =
    `${msgCnt++ % 10 ? document.getElementById("messages").innerHTML + msg : msg} <br>`
})
