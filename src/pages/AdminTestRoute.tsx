import React from 'react';

const AdminTestRoute: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            ✅ Admin Route Test - SUCCESS!
          </h1>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                Route Information
              </h2>
              <div className="space-y-2 text-green-700">
                <p><strong>URL:</strong> /admin/test-route</p>
                <p><strong>Component:</strong> AdminTestRoute</p>
                <p><strong>Status:</strong> ✅ Working</p>
                <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                Navigation Test
              </h2>
              <div className="space-y-2">
                <button 
                  onClick={() => window.location.href = '/admin'}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Go to Dashboard
                </button>
                <button 
                  onClick={() => window.location.href = '/admin/tour-form-simple'}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-2"
                >
                  Go to Simple Tour Form
                </button>
                <button 
                  onClick={() => window.location.href = '/admin/tour-form-extended'}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ml-2"
                >
                  Go to Extended Tour Form
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                Debug Information
              </h2>
              <div className="space-y-2 text-yellow-700 text-sm">
                <p><strong>Browser:</strong> {navigator.userAgent}</p>
                <p><strong>URL:</strong> {window.location.href}</p>
                <p><strong>Pathname:</strong> {window.location.pathname}</p>
                <p><strong>Search:</strong> {window.location.search}</p>
                <p><strong>Hash:</strong> {window.location.hash}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTestRoute;
