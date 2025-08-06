import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from './Category.js';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  main_image_url?: string;
  category_id?: mongoose.Types.ObjectId | ICategory;
  is_featured: boolean;
  specifications?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  main_image_url: {
    type: String,
    trim: true
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  specifications: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Create indexes
productSchema.index({ slug: 1 });
productSchema.index({ category_id: 1 });
productSchema.index({ is_featured: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });

// Pre-save middleware to generate slug if not provided
productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

// Virtual for formatted price
productSchema.virtual('formatted_price').get(function() {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(this.price);
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;