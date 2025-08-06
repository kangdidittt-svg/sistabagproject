/**
 * Categories API routes
 * Handle category CRUD operations and public category queries
 */
import { Router, type Request, type Response } from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Promo from '../models/Promo.js';
import { authenticateAdmin, catchAsync, AppError } from '../middleware/index.js';
import mongoose from 'mongoose';

const router = Router();

/**
 * Get all categories (Public)
 * GET /api/categories
 */
router.get('/', catchAsync(async (req: Request, res: Response): Promise<void> => {
  const categories = await Category.find().sort({ name: 1 });
  
  // Get product count for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const productCount = await Product.countDocuments({ category_id: category._id });
      const categoryObj = {
      ...category.toObject(),
      product_count: productCount
    };
      return categoryObj;
    })
  );

  res.status(200).json({
    success: true,
    data: categoriesWithCount
  });
}));

/**
 * Get category by ID or slug (Public)
 * GET /api/categories/:identifier
 */
router.get('/:identifier', catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { identifier } = req.params;
  
  // Check if identifier is ObjectId or slug
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };
  
  const category = await Category.findOne(query);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Get product count
  const productCount = await Product.countDocuments({ category_id: category._id });
  
  const categoryObj = {
    ...category.toObject(),
    product_count: productCount
  };

  res.status(200).json({
    success: true,
    data: categoryObj
  });
}));

/**
 * Get products by category (Public)
 * GET /api/categories/:identifier/products
 */
router.get('/:identifier/products', catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { identifier } = req.params;
  const { page = 1, limit = 12, search } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Find category first
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  const categoryQuery = isObjectId ? { _id: identifier } : { slug: identifier };
  
  const category = await Category.findOne(categoryQuery);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  // Build product query
  const productQuery: any = { category_id: category._id };
  
  if (search) {
    productQuery.$text = { $search: search as string };
  }

  // Get products
  const products = await Product.find(productQuery)
    .populate('category_id', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Product.countDocuments(productQuery);

  // Get active promos that apply to this category
  const activePromos = await Promo.find({
    applicable_categories: category._id,
    is_active: true,
    start_date: { $lte: new Date() },
    end_date: { $gte: new Date() }
  });

  // Add promo info to products
  const productsWithPromos = products.map(product => {
    const productObj = product.toObject();
    const promo = activePromos.find(p => 
      p.applicable_categories.some((catId: any) => catId.toString() === category._id.toString())
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
    data: {
      category,
      products: productsWithPromos
    },
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
 * Create new category (Admin only)
 * POST /api/categories
 */
router.post('/', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const categoryData = req.body;
  
  const category = await Category.create(categoryData);
  
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
}));

/**
 * Update category (Admin only)
 * PUT /api/categories/:id
 */
router.put('/:id', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  
  const category = await Category.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  
  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category
  });
}));

/**
 * Delete category (Admin only)
 * DELETE /api/categories/:id
 */
router.delete('/:id', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  // Check if category has products
  const productCount = await Product.countDocuments({ category_id: id });
  
  if (productCount > 0) {
    throw new AppError('Cannot delete category with existing products', 400);
  }
  
  const category = await Category.findByIdAndDelete(id);
  
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
}));

export default router;