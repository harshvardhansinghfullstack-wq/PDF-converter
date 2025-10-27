import React from 'react';

export default function SubscriptionPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Section */}
      <aside className="w-80 bg-white shadow-lg p-8 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-6">
          
          <img
            
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50 rounded-full">
            
          </div>
        </div>
        <nav className="w-full mt-6">
          <ul className="text-lg font-semibold text-gray-700">
           
          </ul>
        </nav>
        <button
          className="mt-auto w-full px-6 py-4 bg-indigo-600 text-white text-center font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Log Out
        </button>
      </aside>

      {/* Main Content Section */}
      <main className="flex-1 p-12">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 space-y-8">
          <h2 className="text-4xl font-semibold text-gray-800">Subscription Plans</h2>

          <div className="mt-6 space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Upgrade to Premium <span role="img" aria-label="premium">💎</span>
            </h3>

            {/* Subscription Features List */}
            <ul className="list-disc pl-6 text-lg text-gray-700 space-y-3">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✔</span>
                <span>Full access to all tools in FileMint</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✔</span>
                <span>Unlimited storage for all your files</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✔</span>
                <span>Work on Web, Mobile, and Desktop</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✔</span>
                <span>Convert scanned PDFs to Word with OCR, Sign with digital signatures, audio to PDF, PDF language Converter, API Generator, Bulk PDF Merge</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✔</span>
                <span>No Ads</span>
              </li>
            </ul>

            {/* Upgrade Button */}
            {/* <Button className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all"> */}
              Upgrade Now
            {/* </Button> */}

            {/* Subscription Benefits */}
            <div className="mt-8 bg-indigo-100 p-6 rounded-lg shadow-md space-y-4">
              <h4 className="text-xl font-semibold text-indigo-700">Why Upgrade?</h4>
              <p className="text-gray-700">
                By upgrading to the premium subscription, you unlock unlimited access to all the tools in FileMint, including advanced PDF conversions, better file management, and more.
              </p>
              <p className="text-gray-700">
                Plus, you'll never have to worry about ads and will enjoy a smooth, uninterrupted experience across all devices.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
