const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { mongoUrl } = require('./keys');
const socketIo = require('socket.io');
const http = require('http'); 

const app = express();
const PORT = 8080;
let cors = require("cors");
app.use(cors());
require('./models/users');
require('./models/vehicles');
require('./models/ride');
require('./models/request');
const requireToken = require('./middleware/requireToken');

const authRoutes = require('./routes/authRoutes');

const server = http.createServer(app); 

const io = socketIo(server);

app.use(authRoutes);

app.use(bodyParser.json()); 

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
app.set('io', io);

mongoose.connect(mongoUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', requireToken, (req, res) => {
    res.send({ email: req.user.email });
    console.log(req.user.email);
});

app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Hi there');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
