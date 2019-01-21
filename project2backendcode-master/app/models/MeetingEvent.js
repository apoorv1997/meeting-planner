'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let eventSchema = new Schema({
  eventId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  createdById:{
    type:String,
    default:''
  },
  createdByName:{
    type:String,
    default:''
  },
  title: {
    type: String,
    default: ''
  },
  purpose: {
    type: String,
    default: ''
  },
  colorPrimary: {
    type: String,
    default: ''
  },
  colorSecoundry: {
    type: String,
    default: ""
  },
  createdOn :{
    type:Date,
    default:Date.now()
  },
  start :{
    type:Date,
    default:""
  },
  end :{
    type:Date,
    default:""
  },
  participants:[]
})


mongoose.model('Event', eventSchema);