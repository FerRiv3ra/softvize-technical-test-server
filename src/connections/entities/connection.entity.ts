import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

@Schema({ timestamps: true })
export class Connection extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  connectedUser: Types.ObjectId;
}

/**
 * Connection document type with soft delete support.
 */
export type ConnectionDocument = HydratedDocument<Connection> &
  mongooseDelete.SoftDeleteDocument;

/**
 * Mongoose schema for Connection entity, with plugins and virtuals.
 */
export const ConnectionSchema = SchemaFactory.createForClass(Connection);

/**
 * Connection schema plugins and virtuals.
 */
ConnectionSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});
