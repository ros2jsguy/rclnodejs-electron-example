# rclnodejs-electron-example

This very basic project demonstrates how to use the ROS 2 rclnodejs client api with Electron.
No bundler, e.g., Webpack, is used.  

## Prerequisites:
* Nodejs 12, 14-16
* npm or Yarn

## Getting Started
1. Clone this repository
```
git clone xxx`
```

2. Install JavaScript dependencies
```
npm install
``` 

3. Rebuild rclnodejs using Electron node version
```
npx electron-rebuild
```

4. Run
Launch the Electron app to create a ROS 2 node, publisher and subscriber. The publisher will output a message
every second. The subscriber will echo messages it receives from the publisher to stdout.
```
npm start
```

## Special note
This example uses the latest Electron v16 which incorporates Node 14. We must use the rclnodejs [`node-16`](https://github.com/RobotWebTools/rclnodejs/tree/nodejs-16) branch to support node versions greater tha 12.x. Thus we are currently loading the rclnodejs `node-16` branch directly from Github until it is published to the Npmjs repository.
