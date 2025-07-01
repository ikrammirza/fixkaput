import React, { useState, useEffect } from "react";
import Link from "next/link";
import ServiceSection from "./ServiceSection";
import {
  ChevronLeft,
  ChevronRight,
  Wrench,
  Zap,
  Droplets,
  Wind,
  Camera,
  Hammer,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";


const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    {
      url: "https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Professional AC Services",
      subtitle: "Cool comfort, year-round"
    },
    {
      url: "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Expert Carpentry Work",
      subtitle: "Crafting your perfect space"
    },
    {
      url: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Electrical Solutions",
      subtitle: "Power your home safely"
    },
    {
      url: "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Security Systems",
      subtitle: "Protect what matters most"
    }
  ];

  const whyChooseUs = [
    { icon: <Clock className="w-6 h-6" />, text: "Same day service, all days of the week" },
    { icon: <Star className="w-6 h-6" />, text: "5-star customer service experience" },
    { icon: <Shield className="w-6 h-6" />, text: "Transparent pricing with no hidden charges" },
    { icon: <CheckCircle className="w-6 h-6" />, text: "Safety-first approach for customers and technicians" },
    { icon: <Sparkles className="w-6 h-6" />, text: "90-day service warranty guarantee" },
    { icon: <Wrench className="w-6 h-6" />, text: "Certified and experienced technicians" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Carousel Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />

        {carouselImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${index === currentSlide ? 'translate-x-0' :
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
              }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Fix<span className="text-yellow-400">Kaput</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                {carouselImages[currentSlide].title}
              </p>
              <p className="text-lg text-blue-200 mb-10">
                {carouselImages[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services">
                  <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Book Service Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 
             bg-white/20 backdrop-blur-sm text-white 
             p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 
             bg-white/20 backdrop-blur-sm text-white 
             p-3 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

            <div className="relative z-10 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-8 md:mb-0 md:mr-8">
                  <div className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded-full font-bold text-sm mb-4">
                    LIMITED TIME OFFER
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Get 30% OFF
                  </h2>
                  <p className="text-xl text-blue-100 mb-6 max-w-md">
                    On your first service booking. Professional quality at unbeatable prices.
                  </p>
                  <Link href="/services">
                    <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      Claim Offer <ArrowRight className="inline-block ml-2 w-5 h-5" />
                    </button></Link>
                </div>

                <div className="relative">
                  <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <div className="text-center">
                      <span className="text-6xl font-bold text-white">30%</span>
                      <div className="text-white font-semibold">OFF</div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServiceSection />

      {/* Why Choose Us Section */}
      <section className="mt-20 py-16 px-4 md:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Fix<span className="text-yellow-400">Kaput</span>?
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              We provide reliable, efficient, and safe home services with unmatched quality and value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-md"
              >
                <div className="text-yellow-400">
                  {item.icon}
                </div>
                <p className="text-white text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Main;
