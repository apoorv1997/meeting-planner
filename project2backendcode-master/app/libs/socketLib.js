/* This files containes all the sockets code that our proect need*/

/**modules dependencies. */
const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const mailer = require('nodemailer');

const tokenLib = require("./tokenLib.js");
const check = require("./checkLib.js");
const response = require('./responseLib');

const EventModel = mongoose.model('Event');
const UserModel = mongoose.model('User');

let eventAlerts = {};
let eventController = {};
eventController.events = {};

let setServer = (server) => {
    let io = socketio.listen(server)

    let myIo = io.of('/');

    myIo.on('connection', (socket) => {

        eventAlerts.newEvent = (data) => {
            console.log('\x1b[34m%s\x1b[0m', data);
            for (participant of data.participants) {
                socket.emit(participant, { 'type': 'NewEvent', 'message': `${data.createdByName} have made a new event for you`, 'data': data });
                console.log('\x1b[34m%s\x1b[0m', 'New Event Emitted', participant)
                eventController.events[data.eventId] = {};
                eventController.events[data.eventId][participant] = setTimeout(() => {
                    socket.emit(participant, { 'type': 'EventAlert', 'message': `there is an event scheduled at ${data.start - 60000 * 330}`, 'data': data })
                    sendMail({ 'userId': participant, 'text': 'Event is scheduled at ' + data.start, 'subject': 'Scheduled Event' });
                    console.log('\x1b[34m%s\x1b[0m', 'TimeOut occured', participant)
                }, data.start.getTime() - Date.now() - 330 * 60000 - 1000 * 60);
                sendMail({ 'userId': participant, 'text': 'New Event created for you', 'subject': 'New Event' });
            }
        }

        eventAlerts.editEvent = (data) => {
            console.log('\x1b[33m%s\x1b[0m', data);
            for (participant of data.participants) {
                socket.emit(participant, { 'type': 'EditEvent', 'message': `${data.createdByName} has edit an event that you are part of`, 'data': data });
                sendMail({ 'userId': participant, 'text': 'Event Edited which you are a part of', 'subject': 'Event Edited' });
                console.log('\x1b[33m%s\x1b[0m', 'edit Event Emitted', participant)
            }
        }

        eventAlerts.deletedEvent = (data) => {
            console.log('\x1b[32m%s\x1b[0m', data);
            if (eventController.events[data.eventId]) {
                for (participant of data.participants) {
                    socket.emit(participant, { 'type': 'DeleteEvent', 'message': `${data.createdByName} has deleted an event that you are part of`, 'data': data });
                    clearTimeout(eventController.events[data.eventId][participant]);
                    sendMail({ 'userId': participant, 'text': 'Event deleted which you are a part of', 'subject': 'Event Deleted' });
                    console.log('\x1b[32m%s\x1b[0m', 'delete Event Emitted', participant)
                }
            }
        }


    });
}

let transporter = mailer.createTransport({
    service: 'gmail',
    secure: false,
    host: 'http//:localhost',
    port: 3000,
    auth: {
        user: 'dummymailerforproject@gmail.com',
        pass: 'something123@'
    }
});

let sendMail = (data) => {
    UserModel.findOne({ 'userId': data.userId })
        .exec((err, result) => {
            if (err) {
                logger.error('Error while finding user', 'SocketLib:sendMail', 10);
            } else if (check.isEmpty(result)) {
                logger.error('404 Cannot find user in DB', 'SocketLib:sendMail', 10)
            } else {

                let mailOptions = {
                    from: 'dummymailerforproject@gmail.com',
                    to: result.email,
                    subject: data.subject,
                    text: data.text,
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        logger.error(err, 'SocketLib:sendMail', 5)
                    } else {
                        logger.info(info, 'SocketLib:sendMail', 0)
                    }
                })
            }
        });
}


module.exports = {
    setServer: setServer,
    eventAlerts:eventAlerts
}