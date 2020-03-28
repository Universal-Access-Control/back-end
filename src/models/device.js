const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: false,
    unique: true
  },
  isActive: {
    type: Boolean,
    required: false,
    default: true
  },
  registered: {
    type: Boolean,
    required: false,
    default: false
  }
});

deviceSchema.virtual('status').get(function() {
  return !this.isActive ? 'DEACTIVATE' : this.registered ? 'REGISTERED' : 'UNREGISTER';
});

const DeviceModel = mongoose.model('Device', deviceSchema);

module.exports = DeviceModel;
