import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon_url: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ name: 1 });

// Pre-save middleware to generate slug if not provided
categorySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;