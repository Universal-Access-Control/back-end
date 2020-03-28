import { Schema, model, Document } from 'mongoose';

// Interfaces
interface DeviceSchema extends Document {
  deviceId: string;
  name?: string;
  isActive?: boolean;
  registered?: boolean;
}

export interface Device extends DeviceSchema {
  status: string;
}

// Codes
const deviceSchema = new Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
    unique: true,
  },
  isActive: {
    type: Boolean,
    required: false,
    default: true,
  },
  registered: {
    type: Boolean,
    required: false,
    default: false,
  },
});

deviceSchema.virtual('status').get(function (this: DeviceSchema) {
  return !this.isActive ? 'DEACTIVATE' : this.registered ? 'REGISTERED' : 'UNREGISTER';
});

const DeviceModel = model<Device>('Device', deviceSchema);

export default DeviceModel;
