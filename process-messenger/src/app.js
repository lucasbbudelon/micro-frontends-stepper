const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {

    socket.on('on-message', message => {
        io.emit('message', message);
    });

    socket.on('on-change-process', process => {
        io.emit('change-process', process);
    });

    socket.on('on-next-step', process => {
        io.emit('next-step', process);
    });

    socket.on('on-back-step', process => {
        io.emit('back-step', process);
    });

    socket.on('on-block-process', process => {
        io.emit('block-process', process);
    });

    socket.on('on-unlock-process', process => {
        socket.emit('unlock-process', process);
    });

    io.emit('new-connections', socket.id);
});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});