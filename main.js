// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, ipcMain, Menu } = require('electron')
const path = require('path')
const rclnodejs = require('rclnodejs')

const APPDATA = {
  app: null,
  mainWindow: null,
  rosNode: null,
  rosPublisher: null,
  rosPublisherInterval: null,
  rosSubscriber: null
}

// Create the browser window.
const createWindow = async () => {
  APPDATA.mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  let menu = Menu.buildFromTemplate([
    {
        label: 'File',
            submenu: [
            {
              label: 'Dev Tools',
              role: 'toggleDevTools'
            },
            {
              label:'Exit', 
              role: 'quit'
            }
        ]
    }
  ])
  Menu.setApplicationMenu(menu)

  // and load the index.html of the app.
  APPDATA.mainWindow.loadFile('index.html')
}


const createRosNode = async (subscriberCallback) => {
  await rclnodejs.init();

  const topic = 'topic'
  const msgtype = 'std_msgs/msg/String'
  APPDATA.rosNode = new rclnodejs.Node('publisher_example_node')
  APPDATA.rosSubscriber = APPDATA.rosNode.createSubscription(msgtype, topic, undefined, subscriberCallback);
  APPDATA.rosPublisher = APPDATA.rosNode.createPublisher(msgtype, topic)
  APPDATA.rosNode.spin()
  let counter = 0
  setInterval(() => {
    console.log(`Publishing message: Hello ROS ${counter}`)
    APPDATA.rosPublisher.publish(`Hello ROS ${counter++}`)
  }, 1000)
}

const notifyNewTopicMsg = (msg) => {
  // send msg to renderer
  APPDATA.mainWindow.webContents.send('rosmsg', msg.data);
}

const main = async () => {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  await app.whenReady()

  await createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  await createRosNode(notifyNewTopicMsg)
}

main()