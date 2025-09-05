import React from 'react';
import { Heart, Award, Shield, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Kanha Collection</h1>
            <p className="text-lg text-gray-600">
              Your trusted destination for authentic spiritual and devotional items
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-md p-8">
              <Heart className="w-12 h-12 text-orange-500 mb-4" fill="currentColor" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To provide authentic, high-quality spiritual items that enhance your devotional 
                practices and bring divine blessings into your home. We believe in preserving 
                traditional craftsmanship while making sacred items accessible to everyone.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8">
              <Award className="w-12 h-12 text-orange-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quality Promise</h2>
              <p className="text-gray-600 leading-relaxed">
                Every product in our collection is carefully selected and quality-tested. 
                We work directly with skilled artisans and trusted suppliers to ensure 
                authenticity and craftsmanship in every item we offer.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Authentic Products</h3>
                <p className="text-gray-600 text-sm">
                  Genuine spiritual items sourced from traditional craftsmen
                </p>
              </div>
              <div className="text-center">
                <Users className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Expert Curation</h3>
                <p className="text-gray-600 text-sm">
                  Carefully selected by spiritual practitioners and experts
                </p>
              </div>
              <div className="text-center">
                <Heart className="w-10 h-10 text-orange-500 mx-auto mb-4" fill="currentColor" />
                <h3 className="font-semibold text-lg mb-2">With Devotion</h3>
                <p className="text-gray-600 text-sm">
                  Every item is handled with care and blessed before delivery
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
            <p className="mb-6">
              Have questions about our products or need spiritual guidance? 
              We're here to help you on your divine journey.
            </p>
            <div className="space-y-2">
              <p className="text-orange-100">📞 Phone: +91 98765 43210</p>
              <p className="text-orange-100">📧 Email: namaste@krishnastore.com</p>
              <p className="text-orange-100">🕐 Hours: Monday - Saturday, 9 AM - 7 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;