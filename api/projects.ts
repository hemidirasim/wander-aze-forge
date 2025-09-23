import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Return mock projects data for now
    const mockProjects = [
      {
        id: 1,
        title: "Khinalig Village Development",
        description: "A comprehensive development project focused on improving infrastructure and tourism facilities in the ancient village of Khinalig.",
        category: "community_development",
        location: "Khinalig, Quba District",
        start_date: "2024-01-15",
        end_date: "2025-12-31",
        budget: 250000.00,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
        gallery_urls: [],
        created_at: "2024-01-15T00:00:00Z",
        updated_at: "2024-01-15T00:00:00Z"
      },
      {
        id: 2,
        title: "Gobustan National Park Conservation",
        description: "Environmental conservation project to protect the UNESCO World Heritage site of Gobustan.",
        category: "conservation",
        location: "Gobustan, Absheron District",
        start_date: "2023-06-01",
        end_date: "2024-12-31",
        budget: 180000.00,
        status: "active",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        gallery_urls: [],
        created_at: "2023-06-01T00:00:00Z",
        updated_at: "2023-06-01T00:00:00Z"
      }
    ];

    return res.status(200).json({
      success: true,
      data: { projects: mockProjects }
    });
  }

  if (req.method === 'POST') {
    // Return success for now
    return res.status(201).json({
      success: true,
      data: { project: { id: Date.now(), ...req.body } },
      message: 'Project created successfully'
    });
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}
