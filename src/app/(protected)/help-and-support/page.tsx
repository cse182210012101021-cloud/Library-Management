import React from 'react';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 text-gray-200">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3 text-white">Help & Support</h1>
        <p className="text-gray-400">
          We are here to help you. Find answers to common questions below or contact us directly.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* Left: Simple FAQ */}
        <div>
          <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-700 text-white">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-white">How do I borrow a book?</h3>
              <p className="text-sm text-gray-400 mt-1">Go to the 'Books' section after login, find your desired book, and click on 'Apply'.</p>
            </div>

            <div>
              <h3 className="font-medium text-white">What happens if I return a book late?</h3>
              <p className="text-sm text-gray-400 mt-1">Returning a book after the due date will incur a specific daily fine.</p>
            </div>

            <div>
              <h3 className="font-medium text-white">How can I reset my password?</h3>
              <p className="text-sm text-gray-400 mt-1">Use the 'Forgot Password' link on the login page to reset your password via email.</p>
            </div>
          </div>
        </div>

        {/* Right: Contact Information */}
        <div>
          <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-700 text-white">Contact Us</h2>

          <div className="bg-black p-6 rounded-lg border border-gray-800">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Email Support</p>
              <p className="font-medium text-white">support@library.com</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Helpline</p>
              <p className="font-medium text-white">+880 1234-******</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium text-white leading-relaxed">
                Leading University, Sylhet,<br />
                Leading University Library.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
