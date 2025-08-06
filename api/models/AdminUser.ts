import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUser extends Document {
  username: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminUserSchema = new Schema<IAdminUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'super_admin']
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
adminUserSchema.index({ username: 1 });

// Hash password before saving
adminUserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password_hash')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password_hash, 12);
    this.password_hash = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to check password
adminUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  } catch (error) {
    return false;
  }
};

// Remove password from JSON output
adminUserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password_hash;
  return userObject;
};

const AdminUser = mongoose.model<IAdminUser>('AdminUser', adminUserSchema);

export default AdminUser;