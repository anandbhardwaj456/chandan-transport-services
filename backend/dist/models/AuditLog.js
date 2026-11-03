import mongoose, { Schema } from 'mongoose';
const auditLogSchema = new Schema({
    action: { type: String, required: true },
    user: { type: String },
    resource: { type: String },
    details: { type: Schema.Types.Mixed },
}, { timestamps: true });
const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
