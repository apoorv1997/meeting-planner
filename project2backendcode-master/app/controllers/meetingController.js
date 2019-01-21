/*
    File for Events creation updation and delete;
*/

//Dependencies
const mongoose = require('mongoose');
const shortid = require('shortid');
const response = require('./../libs/responseLib')
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');
const time = require('../libs/timeLib');
const socketio = require('socket.io');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const mailer = require('nodemailer');
const socketLib = require('../libs/socketLib');

//importing models
const EventModel = mongoose.model('Event');
const UserModel = mongoose.model('User');

//initialize the event controller
let eventController = {};

//Function for Event creation
//required Fields: title,purpose,colorPrimary,colorSecoundry,start,end,participants
//No optional fields
eventController.createEvent = (req, res) => {

    //check if req body is present
    if (req.body) {
        //create a new event
        let newEvent = new EventModel({
            eventId: shortid.generate(),
            title: req.body.title,
            purpose: req.body.purpose,
            colorPrimary: req.body.colorPrimary || "",
            colorSecoundry: req.body.colorSecoundry || "",
            start: time.convertToLocalTime(req.body.start),
            end: time.convertToLocalTime(req.body.end),
            createdById: req.body.createdById,
            createdByName: req.body.createdByName,
            createdOn: time.now()
        });

        newEvent.participants = check.isEmpty(req.body.participants) ? [] : req.body.participants.split(',');

        newEvent.save((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'Error in DB while creating new event', 500, null);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'Error while creating new event', 500, null);
                res.send(apiResponse);
            } else {
                // eventEmitter.emit('NewEvent', newEvent);
                socketLib.eventAlerts.newEvent(newEvent);
                let apiResponse = response.generate(false, 'New event created', 200, result);
                res.send(apiResponse);
            }
        });
    } else {
        let apiResponse = response.generate(true, 'Req body was empty pls make a valid request', 400, null);
        res.send(apiResponse);
    }

};


//Event update function
//Required field eventId
//Optional fileds title,purpose,colorPrimary,colorSecoundry,start,end,participants
eventController.editEvent = (req, res) => {

    //check if eventId is present
    if (req.params.eventId) {

        if (req.body) {

            let options = req.body;

            if (options.participants) {
                options.participants = options.participants.split(',')
            }

            EventModel.findOneAndUpdate({ 'eventId': req.params.eventId }, options, (err, result) => {
                if (err) {
                    let apiResponse = response.generate(true, 'error in Db while updating event', 500, null);
                    res.send(apiResponse);
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'Cannot find the event with the given event Id', 400, null);
                    res.send(apiResponse);
                } else {
                    // eventEmitter.emit('EditEvent', result);
                    socketLib.eventAlerts.editEvent(result);
                    let apiResponse = response.generate(false, 'event updated', 200, result);
                    res.send(apiResponse);
                }
            });

        } else {
            let apiResponse = response.generate(true, 'No body provided for updating', 400, null);
            res.send(apiResponse);
        }

    } else {
        let apiResponse = response.generate(true, 'event Id missing from the route', 400, null);
        res.send(apiResponse);
    }
};

//Event delete Function
//required field event Id
eventController.deleteEvent = (req, res) => {
    if (req.params.eventId) {

        //delete the following event from DB
        EventModel.findOneAndRemove({ 'eventId': req.params.eventId }, (err, result) => {
            if (err) {
                let apiResponse = response.generate(true, 'Error in DB while deleting the event', 500, null);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'Specified event is not present in the DB', 400, null);
                res.send(apiResponse);
            } else {
                // eventEmitter.emit('EventDeleted', result);
                socketLib.eventAlerts.deletedEvent(result);
                let apiResponse = response.generate(false, 'Event Deleted', 200, result);
                res.send(apiResponse);
            };
        });

    } else {
        let apiResponse = response.generate(true, 'Cannot find the event Id in params', 400, null);
        res.send(apiResponse);
    }
};


//get event for specified User
//requiredField: userId
//optional fields: none
eventController.getUserEvents = (req, res) => {

    //check for userId
    if (req.params.userId) {
        EventModel.find({ 'participants': req.params.userId, 'end': { $gt: Date.now() } })
            .select("-__v -_id")
            .skip(parseInt(req.query.skip))
            .sort("end")
            .limit(10)
            .exec((err, result) => {
                if (err) {
                    let apiResponse = response.generate(true, 'Error in DB while retriving user Events', 500, null);
                    res.send(apiResponse);
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No Event Found for this User', 400, null);
                    res.send(apiResponse);
                } else {
                    let apiResponse = response.generate(false, 'Events Data', 200, result);
                    res.send(apiResponse);
                }
            });
    } else {
        let apiResponse = response.generate(true, 'No userId present in the request', 400, null);
        res.send(apiResponse);
    };
};


//function to get a particularEvent
//required field: eventId
//optional field: none
eventController.getParticularEvent = (req, res) => {
    if (req.params.eventId) {

        //find the particular event and return it
        EventModel.findOne({ 'eventId': req.params.eventId })
            .select("-__v -_id")
            .exec((err, result) => {
                if (err) {
                    let apiResponse = response.generate(true, 'Error in Db while finding event', 500, null);
                    res.send(apiResponse);
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true, 'No event Present by this Id', 400, null);
                    res.send(apiResponse);
                } else {
                    let apiResponse = response.generate(false, 'Event Data', 200, result);
                    res.send(apiResponse);
                }
            });

    } else {
        let apiResponse = response.generate(true, 'No event Id present in request', 400, null);
        res.send(apiResponse);
    }
};



//all events
//TODO Delete this method
// eventController.allEvents = (req, res) => {
//     EventModel.find()
//         .exec((err, result) => {
//             res.send(result)
//         });
// };

// eventController.events = {};

// eventController.setServer = (server) => {
//     let io = socketio.listen(server)

//     let myIo = io.of('/');

//     myIo.on('connection', (socket) => {
//         console.log('connection Made')

//         eventEmitter.on('NewEvent', (data) => {
//             console.log('\x1b[34m%s\x1b[0m', data);
//             for (participant of data.participants) {
//                 socket.emit(participant, { 'type': 'NewEvent', 'message': `${data.createdByName} have made a new event for you`, 'data': data });
//                 console.log('\x1b[34m%s\x1b[0m', 'New Event Emitted', participant)
//                 eventController.events[data.eventId] = {};
//                 eventController.events[data.eventId][participant] = setTimeout(() => {
//                     socket.emit(participant, { 'type': 'EventAlert', 'message': `there is an event scheduled at ${data.start - 60000 * 330}`, 'data': data })
//                     sendMail({ 'userId': participant, 'text': 'Event is scheduled at ' + data.start, 'subject': 'Scheduled Event' });
//                     console.log('\x1b[34m%s\x1b[0m', 'TimeOut occured', participant)
//                 }, data.start.getTime() - Date.now() - 330 * 60000 - 1000 * 60);
//                 sendMail({ 'userId': participant, 'text': 'New Event created for you', 'subject': 'New Event' });
//             }
//         });

//         eventEmitter.on('EditEvent', (data) => {
//             console.log('\x1b[33m%s\x1b[0m', data);
//             for (participant of data.participants) {
//                 socket.emit(participant, { 'type': 'EditEvent', 'message': `${data.createdByName} has edit an event that you are part of`, 'data': data });
//                 sendMail({ 'userId': participant, 'text': 'Event Edited which you are a part of', 'subject': 'Event Edited' });
//                 console.log('\x1b[33m%s\x1b[0m', 'edit Event Emitted', participant)
//             }
//         });

//         eventEmitter.on('EventDeleted', (data) => {
//             console.log('\x1b[32m%s\x1b[0m', data);
//             if (eventController.events[data.eventId]) {
//                 for (participant of data.participants) {
//                     socket.emit(participant, { 'type': 'DeleteEvent', 'message': `${data.createdByName} has deleted an event that you are part of`, 'data': data });
//                     clearTimeout(eventController.events[data.eventId][participant]);
//                     sendMail({ 'userId': participant, 'text': 'Event deleted which you are a part of', 'subject': 'Event Deleted' });
//                     console.log('\x1b[32m%s\x1b[0m', 'delete Event Emitted', participant)
//                 }
//             }
//         });

//     });

// }

// let transporter = mailer.createTransport({
//     service: 'gmail',
//     secure: false,
//     host: 'http//:localhost',
//     port: 3000,
//     auth: {
//         user: 'dummymailerforproject@gmail.com',
//         pass: 'something123@'
//     }
// });

// let sendMail = (data) => {
//     UserModel.findOne({ 'userId': data.userId })
//         .exec((err, result) => {
//             if (err) {
//                 logger.error('Error while finding user', 'SocketLib:sendMail', 10);
//             } else if (check.isEmpty(result)) {
//                 logger.error('404 Cannot find user in DB', 'SocketLib:sendMail', 10)
//             } else {

//                 let mailOptions = {
//                     from: 'dummymailerforproject@gmail.com',
//                     to: result.email,
//                     subject: data.subject,
//                     text: data.text,
//                 };

//                 transporter.sendMail(mailOptions, (err, info) => {
//                     if (err) {
//                         logger.error(err, 'SocketLib:sendMail', 5)
//                     } else {
//                         logger.info(info, 'SocketLib:sendMail', 0)
//                     }
//                 })
//             }
//         });
// }


//exporting the module
module.exports = eventController;