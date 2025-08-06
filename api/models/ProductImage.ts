import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './Product.js';

export interface IProductImage extends Document {
  product_id: mongoose.Types.ObjectId | IProduct;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<IProductImage>({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  image_url: {
    type: String,
    required: true,
    trim: true
  },
  alt_text: {
    type: String,
    maxlength: 200,
    trim: true
  },
  sort_order: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Create indexes
productImageSchema.index({ product_id: 1 });
productImageSchema.index({ sort_order: 1 });
productImageSchema.index({ product_id: 1, sort_order: 1 });

// Pre-save middleware to set alt_text if not provided
productImageSchema.pre('save', async function(next) {
  if (!this.alt_text && this.product_id) {
    try {
      const Product = mongoose.model('Product');
      const product = await Product.findById(this.product_id);
      if (product) {
        this.alt_text = `${product.name} - Image ${this.sort_order + 1}`;
      }
    } catch (error) {
      // Continue without setting alt_text if product not found
    }
  }
  next();
});

const ProductImage = mongoose.model<IProductImage>('ProductImage', productImageSchema);

export default ProductImage;