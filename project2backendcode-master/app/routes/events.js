const express = require('express');
const router = express.Router();
const meetingController = require('./../../app/controllers/meetingController');
const appConfig = require("./../../config/appConfig");
const auth = require("./../middlewares/auth");

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/event`;
    // defining routes.

        // defining routes.
    app.post(`${baseUrl}/create`,auth.isAuthorized,meetingController.createEvent);
    /**
     * @apiGroup event
     * @apiVersion  1.0.0
     * @api {post} /api/project2/event/create api for event creation.
     *
     * @apiParam {string} title title of the event. (body params) (required)
     * @apiParam {string} purpose purpose of the event. (body params) (required)
     * @apiParam {string} start start Date and time of the event. (body params)(required)
     * @apiParam {string} end end Date and time of the event. (body params) (required)
     * @apiParam {string} participants participants of the event. (body params)(required)
     * @apiParam {string} colorPrimary color primary for the event. (body params)(required)
     * @apiParam {string} colorSecoundry color secoundry for the event. (body params)(required)
     * @apiParam {string} createdByName Name of creater of the event. (body params)(required)
     * @apiParam {string} createdById id of the creater of the event. (body params)(required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "New event created",
            "status": 200,
            "data": {
               "Event Data"
            }
        }
    */

    app.put(`${baseUrl}/edit/:eventId`,auth.isAuthorized,meetingController.editEvent);
    /**
     * @apiGroup event
     * @apiVersion  1.0.0
     * @api {put} /api/project2/event/edit/:eventId api to edit event.
     *
     * @apiParam {string} eventId eventId of the event. (route params) (required)
     * @apiParam {string} title title of the event. (body params)
     * @apiParam {string} purpose purpose of the event. (body params)
     * @apiParam {string} start start Date and time of the event. (body params)
     * @apiParam {string} end end Date and time of the event. (body params) 
     * @apiParam {string} participants participants of the event. (body params)
     * @apiParam {string} colorPrimary color primary for the event. (body params)
     * @apiParam {string} colorSecoundry color secoundry for the event. (body params)
     * @apiParam {string} createdByName Name of creater of the event. (body params)
     * @apiParam {string} createdById id of the creater of the event. (body params)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "event updated",
            "status": 200,
            "data": {
               "Updated Event Data"
            }
        }
    */

    app.delete(`${baseUrl}/delete/:eventId`,auth.isAuthorized,meetingController.deleteEvent);
    /**
     * @apiGroup event
     * @apiVersion  1.0.0
     * @api {delete} /api/project2/event/delete/:eventId api to delete event.
     *
     * @apiParam {string} eventId eventId of the event. (route params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Event Deleted",
            "status": 200,
            "data": {
               "deleted Event Data"
            }
        }
    */

    app.get(`${baseUrl}/getEvents/:userId`,auth.isAuthorized,meetingController.getUserEvents);
    /**
     * @apiGroup event
     * @apiVersion  1.0.0
     * @api {get} /api/project2/event/getEvents/:userId api to get events related to a user.
     *
     * @apiParam {string} userId userId of the user. (route params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Event Data",
            "status": 200,
            "data": {
               "Event Data"
            }
        }
    */
    
    // app.get(`${baseUrl}/allEvents`,meetingController.allEvents);

    app.get(`${baseUrl}/get/:eventId`,auth.isAuthorized,meetingController.getParticularEvent);
    /**
     * @apiGroup event
     * @apiVersion  1.0.0
     * @api {get} /api/project2/event/get/:eventId api to get an event Data.
     *
     * @apiParam {string} eventId eventId of the user. (route params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Event Data",
            "status": 200,
            "data": {
               "Event Data"
            }
        }
    */
}
