import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { tourId, participants } = req.body;

    if (!tourId || !participants) {
      return res.status(400).json({
        success: false,
        error: 'Tour ID and participants are required'
      });
    }

    // Get tour pricing information
    const tourResult = await pool.query(`
      SELECT 
        id, title, base_price, pricing_policy, 
        min_participants, max_participants,
        bulk_discount_threshold, bulk_discount_percentage,
        group_required_min, group_required_max
      FROM tours 
      WHERE id = $1
    `, [tourId]);

    if (tourResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tour not found'
      });
    }

    const tour = tourResult.rows[0];
    const participantCount = parseInt(participants);

    // Validate participant count
    if (participantCount < tour.min_participants || participantCount > tour.max_participants) {
      return res.status(400).json({
        success: false,
        error: `Number of participants must be between ${tour.min_participants} and ${tour.max_participants}`,
        min_participants: tour.min_participants,
        max_participants: tour.max_participants
      });
    }

    let pricePerPerson = tour.base_price;
    let totalPrice = pricePerPerson * participantCount;
    let discountApplied = 0;
    let discountPercentage = 0;
    let pricingDetails = {
      basePrice: tour.base_price,
      participants: participantCount,
      pricePerPerson: pricePerPerson,
      totalPrice: totalPrice,
      discountApplied: discountApplied,
      discountPercentage: discountPercentage,
      pricingPolicy: tour.pricing_policy
    };

    // Apply pricing policy
    if (tour.pricing_policy === 'bulk_discount') {
      if (participantCount >= tour.bulk_discount_threshold) {
        discountPercentage = tour.bulk_discount_percentage;
        pricePerPerson = tour.base_price * (1 - discountPercentage / 100);
        totalPrice = pricePerPerson * participantCount;
        discountApplied = (tour.base_price - pricePerPerson) * participantCount;
        
        pricingDetails = {
          ...pricingDetails,
          pricePerPerson: pricePerPerson,
          totalPrice: totalPrice,
          discountApplied: discountApplied,
          discountPercentage: discountPercentage,
          bulkDiscountThreshold: tour.bulk_discount_threshold
        };
      }
    } else if (tour.pricing_policy === 'group_required') {
      if (participantCount < tour.group_required_min) {
        return res.status(400).json({
          success: false,
          error: `This tour requires a minimum of ${tour.group_required_min} participants`,
          minRequired: tour.group_required_min,
          maxAllowed: tour.group_required_max
        });
      }
      if (participantCount > tour.group_required_max) {
        return res.status(400).json({
          success: false,
          error: `This tour allows maximum ${tour.group_required_max} participants`,
          minRequired: tour.group_required_min,
          maxAllowed: tour.group_required_max
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: pricingDetails,
      message: 'Price calculated successfully'
    });

  } catch (error) {
    console.error('Calculate price error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate price',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
