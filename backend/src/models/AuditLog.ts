import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  user?: string;
  resource?: string;
  details?: Record<string, any>;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  action: { type: String, required: true },
  user: { type: String },
  resource: { type: String },
  details: { type: Schema.Types.Mixed },
}, { timestamps: true });

const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

export default AuditLog;
