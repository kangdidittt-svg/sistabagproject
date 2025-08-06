import mongoose, { Document, Schema } from 'mongoose';

export interface IPromo extends Document {
  title: string;
  description: string;
  discount_percentage: number;
  max_discount: number;
  start_date: Date;
  end_date: Date;
  applicable_categories: mongoose.Types.ObjectId[];
  is_active: boolean;
  image?: string;
  created_at: Date;
  updated_at: Date;
  isCurrentlyActive(): boolean;
  calculateDiscountedPrice(originalPrice: number): number;
}

const promoSchema = new Schema<IPromo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  discount_percentage: { type: Number, required: true, min: 0, max: 100 },
  max_discount: { type: Number, required: true, min: 0 },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  applicable_categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  is_active: { type: Boolean, default: true },
  image: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Create indexes
promoSchema.index({ is_active: 1 });
promoSchema.index({ start_date: 1, end_date: 1 });
promoSchema.index({ applicable_categories: 1 });

// Instance method to check if promo is currently active
promoSchema.methods.isCurrentlyActive = function(): boolean {
  const now = new Date();
  return this.is_active && 
         this.start_date <= now && 
         this.end_date >= now;
};

// Instance method to calculate discounted price
promoSchema.methods.calculateDiscountedPrice = function(originalPrice: number): number {
  if (!this.isCurrentlyActive()) {
    return originalPrice;
  }
  
  const discountAmount = originalPrice * (this.discount_percentage / 100);
  const finalDiscount = Math.min(discountAmount, this.max_discount);
  return Math.max(0, originalPrice - finalDiscount);
};

// Virtual for formatted discount
promoSchema.virtual('formatted_discount').get(function() {
  return `${this.discount_percentage}%`;
});

// Pre-save middleware to update updated_at
promoSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Ensure virtual fields are serialized
promoSchema.set('toJSON', { virtuals: true });
promoSchema.set('toObject', { virtuals: true });

const Promo = mongoose.model<IPromo>('Promo', promoSchema);

export default Promo;