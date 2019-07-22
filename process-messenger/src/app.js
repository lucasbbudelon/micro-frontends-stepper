const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {

    socket.on('on-message', message => {
        console.log(`on-message: subject=${message.subject}  app=${message.app}  date=${message.date}`);
        io.emit('message', message);
    });

    io.emit('new-connections', socket.id);
});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});