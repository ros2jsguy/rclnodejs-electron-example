// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const rclnodejs = require('rclnodejs')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  rclnodejs.init().then(() => {
    const topic = 'topic'
    const msgtype = 'std_msgs/msg/String'
    const node = new rclnodejs.Node('publisher_example_node')

    const subscriber = node.createSubscription(msgtype, topic, undefined, msg => {
        console.log('Subscriber received: ', msg.data)
    })

    const publisher = node.createPublisher(msgtype, topic)
    let counter = 0;
    setInterval(() => {
      console.log(`Publishing message: Hello ROS ${counter}`)
      publisher.publish(`Hello ROS ${counter++}`)
    }, 1000)
  
    node.spin(node)
  })

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.