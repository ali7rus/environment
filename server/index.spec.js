// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const { Server } = require('http');
// const SocketIO = require('socket.io');
// const app = require('../server/index');
// const { expect } = chai;

// chai.use(chaiHttp);

// let httpServer;
// let ioServer;
// let clientSocket;

// describe('Test Suite', () => {
//   before((done) => {
//     httpServer = new Server(app);
//     ioServer = SocketIO(httpServer);
//     httpServer.listen(3002, () => {
//       clientSocket = require('socket.io-client')('http://localhost:3002');
//       clientSocket.on('connect', () => done());
//     });
//   });

//   after((done) => {
//     clientSocket.disconnect();
//     ioServer.close(() => {
//       httpServer.close(done);
//     });
//   });

//   describe('Socket events', () => {
//     describe('BE-join-room', () => {
//       it('should join the room and emit FE-user-join event', (done) => {
//         const roomId = 'room1';
//         const userName = 'user1';

//         clientSocket.on('FE-user-join', (newUser) => {
//           expect(newUser.userId).to.be.a('string');
//           expect(newUser.info.userName).to.equal(userName);
//           done();
//         });

//         clientSocket.emit('BE-join-room', { roomId, userName });
//       });
//     });
//   });
// });