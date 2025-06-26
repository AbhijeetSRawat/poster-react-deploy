import React, { useEffect } from 'react';
import Heading from '../components/core/heading';
import Navbar from '../components/core/Navbar';
import logo from '../assets/img/logo_techbro-removebg-preview.png'

const AboutUs = ({ mode, setMode }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionStyle = `${mode ? 'bg-blue-100 text-gray-800' : 'bg-slate-900 text-white'}`;

  return (
    <div className={`${sectionStyle} min-h-screen pt-[10vh] `}>
      <Heading mode={mode} setMode={setMode} />
      <Navbar mode={mode} setMode={setMode} />

      {/* Why Choose Us Section */}
      <section className="text-center px-4 py-12">
        <h2 className="text-2xl font-bold mb-2">Why Choose Us?</h2>
        <p className="text-gray-500">We simplify poster designing so you can focus on your creativity and business.</p>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="bg-white text-black rounded-lg p-6 shadow">
            <i className="fas fa-image text-4xl text-teal-600 mb-4"></i>
            <h5 className="font-semibold">Image-Based Editing</h5>
            <p className="text-sm mt-2">Upload your product images and instantly apply overlays, logos, and gradients.</p>
          </div>
          <div className="bg-white text-black rounded-lg p-6 shadow">
            <i className="fas fa-layer-group text-4xl text-teal-600 mb-4"></i>
            <h5 className="font-semibold">Layered Customization</h5>
            <p className="text-sm mt-2">Drag logos, add text, and download all posters in one go.</p>
          </div>
          <div className="bg-white text-black rounded-lg p-6 shadow">
            <i className="fas fa-bolt text-4xl text-teal-600 mb-4"></i>
            <h5 className="font-semibold">Fast & Easy</h5>
            <p className="text-sm mt-2">No design skills needed – just click, customize, and download.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-teal-100 text-black px-4 py-12 text-center">
        <h2 className="text-xl font-bold mb-6">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <p>"Poster Customizer has made my daily promotions so simple. I save hours every week!"</p>
            <strong>- Priya, Boutique Owner</strong>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <p>"Loved the UI and how fast everything is. Batch download is a game-changer!"</p>
            <strong>- Rahul, Electronics Retailer</strong>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="px-4 py-12 text-center">
        <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-8 text-left text-sm">
          <div>
            <h5 className="font-semibold">Is Poster Customizer free to use?</h5>
            <p className="text-gray-300">Yes! All features are free. You can create and download unlimited posters.</p>
          </div>
          <div>
            <h5 className="font-semibold">Can I use my own brand logos?</h5>
            <p className="text-gray-300">Absolutely. Upload your logo and position it anywhere you want on the poster.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Customize Your Poster?</h2>
        <a
          href="/customdesign"
          className="bg-white text-teal-700 px-6 py-2 rounded font-semibold shadow hover:bg-gray-100"
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className={`${mode ? 'bg-blue-200 text-gray-800' : 'bg-slate-800 text-gray-200'} text-center text-sm py-6 text-gray-300`}>
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 text-left">
            <div>
              <h3 className="font-semibold mb-2">Useful Links</h3>
              <ul>
                <li>Home</li>
                <li>Customize</li>
                <li>Contact Us</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Make Posts</h3>
              <ul>
                <li>Marketing & Advertising</li>
                <li>Instagram Story</li>
                <li>Month End Sale</li>
                <li>Creative Collection</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Top Services</h3>
              <ul>
                <li>Best Seller Products</li>
                <li>Exclusive Products</li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <img src={logo} alt="Logo" className="h-12 mx-auto md:mx-0" />
              <div className="flex justify-center md:justify-start gap-3 mt-2 text-lg">
                <a href="https://facebook.com"><i className="fab fa-facebook-f" /></a>
                <a href="https://instagram.com"><i className="fab fa-instagram" /></a>
                <a href="https://linkedin.com"><i className="fab fa-linkedin-in" /></a>
                <a href="https://youtube.com"><i className="fab fa-youtube" /></a>
              </div>
              <p className="mt-2">
                <a href="tel:+917597722920">+91 75977 22920</a><br />
                <a href="mailto:info@techbro24.com">info@techbro24.com</a>
              </p>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs">
          &copy; 2025 TechBro24. All Rights Reserved. Designed by
          <a href="https://www.techbro24.com/" target="_blank" rel="noreferrer" className="underline ml-1">TechBro24</a>
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;
