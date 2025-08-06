/**
 * Products API routes
 * Handle product CRUD operations and public product queries
 */
import { Router, type Request, type Response } from 'express';
import Product from '../models/Product.js';
import Promo from '../models/Promo.js';
import ProductImage from '../models/ProductImage.js';
import { authenticateAdmin, catchAsync, AppError } from '../middleware/index.js';
import mongoose from 'mongoose';

const router = Router();

/**
 * Get all products (Public)
 * GET /api/products
 */
router.get('/', catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 12, category, featured, search } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build query
  const query: any = {};
  
  if (category) {
    query.category_id = category;
  }
  
  if (featured === 'true') {
    query.is_featured = true;
  }
  
  if (search) {
    query.$text = { $search: search as string };
  }

  // Get products with category populated
  const products = await Product.find(query)
    .populate('category_id', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Get total count for pagination
  const total = await Product.countDocuments(query);

  // Get active promos that apply to these products' categories
  const categoryIds = products.map(p => p.category_id);
  const activePromos = await Promo.find({
    applicable_categories: { $in: categoryIds },
    is_active: true,
    start_date: { $lte: new Date() },
    end_date: { $gte: new Date() }
  });

  // Add promo info to products
  const productsWithPromos = products.map(product => {
    const productObj = product.toObject();
    const promo = activePromos.find(p => 
      p.applicable_categories.some((catId: any) => catId.toString() === product.category_id.toString())
    );
    
    if (promo) {
      (productObj as any).promo = {
        title: promo.title,
        discount_percentage: promo.discount_percentage,
        max_discount: promo.max_discount,
        discounted_price: promo.calculateDiscountedPrice(product.price)
      };
    }
    
    return productObj;
  });

  res.status(200).json({
    success: true,
    data: productsWithPromos,
    pagination: {
      current_page: pageNum,
      total_pages: Math.ceil(total / limitNum),
      total_items: total,
      items_per_page: limitNum
    }
  });
}));

/**
 * Get product by ID or slug (Public)
 * GET /api/products/:identifier
 */
router.get('/:identifier', catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { identifier } = req.params;
  
  // Check if identifier is ObjectId or slug
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };
  
  const product = await Product.findOne(query).populate('category_id', 'name slug');
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Get product images
  const images = await ProductImage.find({ product_id: product._id })
    .sort({ sort_order: 1 });

  // Get active promo for this product's category
  const activePromo = await Promo.findOne({
    applicable_categories: { $in: [product.category_id] },
    is_active: true,
    start_date: { $lte: new Date() },
    end_date: { $gte: new Date() }
  });

  const productObj = product.toObject();
  (productObj as any).images = images;
  
  if (activePromo) {
    (productObj as any).promo = {
      title: activePromo.title,
      discount_percentage: activePromo.discount_percentage,
      max_discount: activePromo.max_discount,
      discounted_price: activePromo.calculateDiscountedPrice(product.price)
    };
  }

  res.status(200).json({
    success: true,
    data: productObj
  });
}));

/**
 * Search products (Public)
 * GET /api/products/search
 */
router.get('/search/:query', catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { query } = req.params;
  const { page = 1, limit = 12 } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const products = await Product.find({
    $text: { $search: query }
  })
    .populate('category_id', 'name slug')
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments({
    $text: { $search: query }
  });

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      current_page: pageNum,
      total_pages: Math.ceil(total / limitNum),
      total_items: total,
      items_per_page: limitNum
    }
  });
}));

// Admin routes (protected)

/**
 * Create new product (Admin only)
 * POST /api/products
 */
router.post('/', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const productData = req.body;
  
  const product = await Product.create(productData);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
}));

/**
 * Update product (Admin only)
 * PUT /api/products/:id
 */
router.put('/:id', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  
  const product = await Product.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('category_id', 'name slug');
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
}));

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
router.delete('/:id', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  const product = await Product.findByIdAndDelete(id);
  
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  
  // Also delete related product images
  await ProductImage.deleteMany({ product_id: id });
  
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
}));

export default router;