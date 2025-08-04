// User entity schema for MongoDB using Mongoose and NestJS
// Includes password hashing, soft delete, and validation features

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcryptjs';
import { Document, HydratedDocument } from 'mongoose';
import * as mongooseDelete from 'mongoose-delete';

/**
 * User entity representing application users.
 * @extends Document
 */
@Schema({ timestamps: true })
export class User extends Document {
  /**
   * User's avatar URL (optional, trimmed)
   */
  @Prop({ type: String, trim: true, default: null })
  avatar?: string;

  /**
   * User's email address (unique, required, lowercase, trimmed)
   */
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  /**
   * User's hashed password (required)
   */
  @Prop({ required: true })
  password: string;

  /**
   * User's display name (required, trimmed)
   */
  @Prop({ required: true, trim: true })
  name: string;
}

/**
 * User document type with soft delete support.
 */
export type UserDocument = HydratedDocument<User> &
  mongooseDelete.SoftDeleteDocument;

/**
 * Mongoose schema for User entity, with plugins and virtuals.
 */
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongooseDelete, {
  overrideMethods: true,
  deletedAt: true,
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

/**
 * Pre-save hook to hash password if modified.
 */
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
  }
  next();
});

/**
 * Pre-update hook to hash password if updated via findOneAndUpdate.
 */
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as UserDocument;

  if (update.password) {
    const salt = await genSalt();
    update.password = await hash(update.password, salt);
  }
  next();
});

/**
 * toJSON transform to remove password from output.
 */
UserSchema.set('toJSON', {
  transform: (
    _: unknown,
    ret: Partial<UserDocument>,
  ): Partial<UserDocument> => {
    delete ret.password;
    return ret;
  },
});
