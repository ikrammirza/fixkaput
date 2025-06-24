// components/ServicesSection.js
import React from "react";
import Link from "next/link";
import { 
  Wrench, 
  Zap, 
  Droplets, 
  Wind, 
  Camera, 
  Hammer 
} from "lucide-react";

const services = [
  {
    id: 1,
    name: "AC Service & Repair",
    description: "Professional air conditioning maintenance and repair services",
    image: "https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Wind className="w-8 h-8" />,
    category: "HVAC"
  },
  {
    id: 2,
    name: "Geyser Service & Repair", 
    description: "Expert water heater installation and maintenance",
    image: "https://images.pexels.com/photos/8092/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    icon: <Droplets className="w-8 h-8" />,
    category: "PLUMBING"
  },
  {
    id: 3,
    name: "Carpenter Service",
    description: "Professional woodwork and furniture solutions",
    image: "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Hammer className="w-8 h-8" />,
    category: "CARPENTRY"
  },
  {
    id: 4,
    name: "Plumbing Service",
    description: "Complete plumbing solutions for your home",
    image: "https://images.pexels.com/photos/8092/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    icon: <Wrench className="w-8 h-8" />,
    category: "PLUMBING"
  },
  {
    id: 5,
    name: "Electrical Service",
    description: "Safe and reliable electrical installations",
    image: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Zap className="w-8 h-8" />,
    category: "ELECTRICAL"
  },
  {
    id: 6,
    name: "CCTV Service & Repair",
    description: "Advanced security camera installation and maintenance",
    image: "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=800",
    icon: <Camera className="w-8 h-8" />,
    category: "SECURITY"
  }
];

const ServiceSection = () => {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Premium Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional solutions for all your home and office maintenance needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {service.category}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-blue-600">
                  {service.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {service.description}
              </p>
              
              <Link 
  href={`/service${service.id}`} 
  className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
>
  Book Now
</Link>


            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
