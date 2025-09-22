export async function GET() {
  try {
    console.log('Simple test API called');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'API is working',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in simple test API:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
