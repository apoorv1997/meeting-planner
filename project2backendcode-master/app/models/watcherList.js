const time = require('./../libs/timeLib')

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let WatcherSchema = new Schema({
  userId: {
    type: String,
    default: 'no descrition Given',
    unique:true
  },
  notificationCount:{
    type:Number,
    default:0
  },
  issueIdArray:[]
})

mongoose.model('Watcher', WatcherSchema);