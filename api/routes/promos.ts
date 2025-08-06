/**
 * Promos API routes
 * Handle promo CRUD operations and public promo queries
 */
import { Router, type Request, type Response } from 'express';
import Promo from '../models/Promo.js';
import Product from '../models/Product.js';
import { authenticateAdmin, catchAsync, AppError } from '../middleware/index.js';

const router = Router();

/**
 * Get active promos (Public)
 * GET /api/promos/active
 */
router.get('/active', catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 12 } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const activePromos = await Promo.find({
    is_active: true,
    start_date: { $lte: new Date() },
    end_date: { $gte: new Date() }
  })
    .populate('applicable_categories', 'name slug')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Promo.countDocuments({
    is_active: true,
    start_date: { $lte: new Date() },
    end_date: { $gte: new Date() }
  });

  // Return promos as-is since they're category-based now
  const promosWithInfo = activePromos.map(promo => {
    const promoObj = promo.toObject();
    (promoObj as any).is_currently_active = promo.isCurrentlyActive();
    return promoObj;
  });

  res.status(200).json({
    success: true,
    data: promosWithInfo,
    pagination: {
      current_page: pageNum,
      total_pages: Math.ceil(total / limitNum),
      total_items: total,
      items_per_page: limitNum
    }
  });
}));

/**
 * Get promo by ID (Public)
 * GET /api/promos/:id
 */
router.get('/:id', catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  const promo = await Promo.findById(id)
    .populate('applicable_categories', 'name slug');
  
  if (!promo) {
    throw new AppError('Promo not found', 404);
  }

  const promoObj = promo.toObject();
  (promoObj as any).is_currently_active = promo.isCurrentlyActive();

  res.status(200).json({
    success: true,
    data: promoObj
  });
}));

// Admin routes (protected)

/**
 * Get all promos (Admin only)
 * GET /api/promos
 */
router.get('/', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 20, status } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  // Build query based on status filter
  let query: any = {};
  
  if (status === 'active') {
    query = {
      is_active: true,
      start_date: { $lte: new Date() },
      end_date: { $gte: new Date() }
    };
  } else if (status === 'inactive') {
    query.is_active = false;
  } else if (status === 'expired') {
    query = {
      is_active: true,
      end_date: { $lt: new Date() }
    };
  } else if (status === 'upcoming') {
    query = {
      is_active: true,
      start_date: { $gt: new Date() }
    };
  }

  const promos = await Promo.find(query)
    .populate('applicable_categories', 'name slug')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Promo.countDocuments(query);

  // Add additional info to each promo
  const promosWithInfo = promos.map(promo => {
    const promoObj = promo.toObject();
    (promoObj as any).is_currently_active = promo.isCurrentlyActive();
    return promoObj;
  });

  res.status(200).json({
    success: true,
    data: promosWithInfo,
    pagination: {
      current_page: pageNum,
      total_pages: Math.ceil(total / limitNum),
      total_items: total,
      items_per_page: limitNum
    }
  });
}));

/**
 * Create new promo (Admin only)
 * POST /api/promos
 */
router.post('/', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const promoData = req.body;
  
  // Check if there's already an active promo for these categories
  const existingPromo = await Promo.findOne({
    applicable_categories: { $in: promoData.applicable_categories },
    is_active: true,
    start_date: { $lte: new Date(promoData.end_date) },
    end_date: { $gte: new Date(promoData.start_date) }
  });
  
  if (existingPromo) {
    throw new AppError('Categories already have an active promo in the specified date range', 400);
  }
  
  const promo = await Promo.create(promoData);
  
  // Populate the created promo
  const populatedPromo = await Promo.findById(promo._id)
    .populate('applicable_categories', 'name slug');
  
  res.status(201).json({
    success: true,
    message: 'Promo created successfully',
    data: populatedPromo
  });
}));

/**
 * Update promo (Admin only)
 * PUT /api/promos/:id
 */
router.put('/:id', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  
  // No additional validation needed for category-based promos
  
  const promo = await Promo.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate('applicable_categories', 'name slug');
  
  if (!promo) {
    throw new AppError('Promo not found', 404);
  }
  
  res.status(200).json({
    success: true,
    message: 'Promo updated successfully',
    data: promo
  });
}));

/**
 * Delete promo (Admin only)
 * DELETE /api/promos/:id
 */
router.delete('/:id', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  const promo = await Promo.findByIdAndDelete(id);
  
  if (!promo) {
    throw new AppError('Promo not found', 404);
  }
  
  res.status(200).json({
    success: true,
    message: 'Promo deleted successfully'
  });
}));

/**
 * Toggle promo status (Admin only)
 * PATCH /api/promos/:id/toggle
 */
router.patch('/:id/toggle', authenticateAdmin, catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  const promo = await Promo.findById(id);
  
  if (!promo) {
    throw new AppError('Promo not found', 404);
  }
  
  promo.is_active = !promo.is_active;
  await promo.save();
  
  const populatedPromo = await Promo.findById(promo._id)
    .populate('product_id', 'name slug price')
    .populate('created_by', 'name username');
  
  res.status(200).json({
    success: true,
    message: `Promo ${promo.is_active ? 'activated' : 'deactivated'} successfully`,
    data: populatedPromo
  });
}));

export default router;