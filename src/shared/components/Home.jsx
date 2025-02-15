import React from "react";
import { Link} from "react-router-dom";
import { Truck, Package, Clock, MapPin, ChevronRight, Calendar, Shield } from 'lucide-react';
import Courier from "/images/Courier.jpeg"


function Home({navigate,scrolltotop}) {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-red-800 to-purple-800 text-white ">
        <div className="container mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Fast & Reliable Courier Services</h1>
              <p className="text-xl mb-8">Delivering your packages safely and on time.</p>
              {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"> */}
              <div> 
                 <button className="border-2 border-white px-3 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300" onClick={() => navigate("/Trackorder")}>
                  Track Your Order
                </button>
                {/* <button className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
                  Grab yours
                </button>
                <button className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
                  Get in Touch
                </button> */}
              </div>
            </div>
            <div className="flex justify-end md:w-1/2 ">
              <img src={Courier} alt="Delivery illustration" className="rounded-lg  " />
            </div>
          </div>
        </div>
      </header>
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose TCZ Courier  </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast & Reliable Delivery</h3>
              <p className="text-gray-600">Get your packages delivered  with our efficient domestic network</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Coverage</h3>
              <p className="text-gray-600">Delivering to every city, town, and village  with dedicated local partners</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Safe & Secure Handling</h3>
              <p className="text-gray-600">Your parcels are handled with care </p>
            </div>
          </div>
        </div>
      </section>


      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 text-center">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Same-Day Delivery",
                description: "Lightning-fast delivery within the same day for urgency .",
                icon: <Clock className="w-6 h-6" />,
              },
              {
                title: "Next-Day Delivery",
                description: "Reliable next-day delivery across major cities and towns.",
                icon: <Truck className="w-6 h-6" />,
              },
              {
                title: "Weekend & Holiday Delivery",
                description: "Special delivery services even on weekends and public holidays.",
                icon: <Calendar className="w-6 h-6" />,
              },
              {
                title: "Fragile Item Handling",
                description: "Extra care and secure packaging for Fragile Item.",
                icon: <Package className="w-6 h-6" />,
              },
            ].map((service, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link onClick={scrolltotop} to="#" className="text-blue-600 font-semibold flex items-center hover:text-blue-800 ">
                  Learn more <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Section */}
      {/* <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-12 md:mb-0">
                  <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                  <p className="text-gray-600 mb-8">Have feedback? Our team is here to help you 24/7.</p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-6 h-6 text-blue-600 mr-4" />
                      <span>1-800-TCZ-SHIP</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-6 h-6 text-blue-600 mr-4" />
                      <span>123 Shipping Street, Logistics City</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 w-full">
                  <form className="bg-white rounded-lg p-8 shadow-lg">
                    <div className="mb-6">
                      <input type="text" placeholder="Your Name" className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-6">
                      <input type="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-6">
                      <textarea placeholder="Message" rows="4" className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TCZ Courier</h3>
              <p className="text-gray-400">Your trusted delivery partner since xxxx.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#" className="hover:text-white">Services</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Same-Day Delivery</a></li>
                <li><a href="#" className="hover:text-white">Next-Day Delivery</a></li>
                <li><a href="#" className="hover:text-white">Weekend & Holiday Delivery</a></li>
                <li><a href="#" className="hover:text-white">Fragile Item Handling</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>9********7</li>
                <li>tczcourier@gmail.com</li>
                <li>123  Street</li>
                <li>*** City </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TCZ Courier. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


export default Home;
