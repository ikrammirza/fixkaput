import React from "react";
import Head from "next/head";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { TbAirConditioning } from "react-icons/tb";
import { CgSmartHomeBoiler } from "react-icons/cg";
import { MdOutlineCarpenter, MdPlumbing } from "react-icons/md";
import { SiBugcrowd } from "react-icons/si";
import { GiCctvCamera } from "react-icons/gi";
import { Check, Clock, Map, Phone, Quote } from "lucide-react";

const services = [
  {
    id: 1,
    name: "AC Service & Repair",
    link: "/service1",
    shortDescription: "Expert AC maintenance and repair services for all brands and models.",
    longDescription: "Our certified technicians provide comprehensive air conditioning services including installation, maintenance, and repairs. We ensure your AC systems operate at peak efficiency, helping you save on energy costs while maintaining optimal comfort.",
    image: "ACrepair.jpg",
    icon: TbAirConditioning,
    benefits: [
      "Regular maintenance extends AC lifespan",
      "Energy-efficient repairs save on bills",
      "24/7 emergency repair services",
      "Certified technicians for all brands"
    ]
  },
  {
    id: 4,
    name: "Plumbing Service",
    link: "/service2",
    shortDescription: "Comprehensive plumbing solutions for all needs.",
    longDescription: "Our reliable plumbing services address all your water system needs, from minor leaks to major installations. Our licensed plumbers use quality materials and proven techniques to ensure lasting solutions.",
    image: "Taprepair.jpg",
    icon: MdPlumbing,
    benefits: [
      "Fast leak detection and repair",
      "Pipe installation and replacement",
      "Fixture upgrades",
      "Drain cleaning"
    ]
  },
  {
    id: 6,
    name: "CCTV Service",
    link: "/service3",
    shortDescription: "Advanced security solutions and support.",
    longDescription: "Protect your property with our comprehensive CCTV services. From initial consultation and system design to installation and maintenance, we provide end-to-end security solutions with the latest technology.",
    image: "CCTVinstallation.jpeg",
    icon: GiCctvCamera,
    benefits: [
      "Custom security design",
      "Professional installation",
      "Remote monitoring",
      "Regular maintenance"
    ]
  },
  {
    id: 3,
    name: "Carpenter Service",
    link: "/service4",
    shortDescription: "Skilled carpentry work for furniture and installations.",
    longDescription: "Our professional carpentry services cover everything from custom furniture creation to repairs and installations. Our experienced carpenters bring expertise and precision to every project, ensuring high-quality craftsmanship.",
    image: "Carpenter3.jpg",
    icon: MdOutlineCarpenter,
    benefits: [
      "Custom furniture design",
      "Expert wood repairs",
      "Cabinet installations",
      "Door and window repairs"
    ]
  },
  {
    id: 2,
    name: "Electrical Services",
    link: "/service5",
    shortDescription: "Professional geyser solutions for efficient hot water supply.",
    longDescription: "Our geyser service and repair solutions cover all types of water heaters, ensuring you have reliable hot water when you need it. From routine maintenance to complex repairs, our experts handle everything with precision.",
    image: "electrician.jpg",
    icon: CgSmartHomeBoiler,
    benefits: [
      "Expert repairs for all geyser types",
      "Performance optimization",
      "Safety inspections included",
      "Energy-efficient solutions"
    ]
  },
  {
    id: 5,
    name: "Pest Control",
    link: "/service6",
    shortDescription: "Safe and effective pest removal for a healthier home.",
    longDescription: "Our pest control services eliminate common pests like cockroaches, termites, bed bugs, and ants using eco-friendly and odorless treatments. We ensure your living or working spaces remain pest-free with long-lasting protection.",
    image: "general-pest.jpg",
    icon: SiBugcrowd,
    benefits: [
      "Odorless and child-safe treatments",
      "Expert pest identification and elimination",
      "Long-lasting protection",
      "Affordable pricing"
    ]
  },

];


const testimonials = [
  {
    id: 1,
    content: "I booked an AC repair with FixKaput during peak summer. The technician came right on time, cleaned the unit, fixed the cooling issue, and explained everything patiently. Great job!",
    author: "Pooja Reddy",
    position: "Resident, Hyderabad"
  },
  {
    id: 2,
    content: "Had CCTV cameras installed through FixKaput for my home. The technician was professional, explained the setup well, and even helped with the mobile app configuration.",
    author: "Abdul yaseen",
    position: "Flat Owner, Secunderabad"
  },
  {
    id: 3,
    content: "I had a power outage in one room. The electrician from FixKaput identified a loose wire, fixed it in no time, and ensured everything was safe before leaving.",
    author: "Sneha Iyer",
    position: "Working Professional, Gachibowli"
  }
];


export default function ServicesPage() {
  return (
    <>
      <Head>
        <title>fixKaput | Services</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 overflow-x-hidden">
        {/* Hero Section */}
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2Zy...')]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
              <div className="flex flex-col items-center text-center">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Our Home Services
                  <span className="block text-blue-200">Expert Help, Anytime</span>
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Whether it's fixing, installing, or servicing — our professionals are ready to assist you with top-notch quality at your doorstep.
                </motion.p>

                {/* Services Grid */}
                <div className="px-8 sm:px-6 lg:px-8">
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {/* AC Service */}
                    <div className="bg-white/10 hover:scale-105 hover:bg-white/20 p-6 rounded-xl flex flex-col items-center transition-all duration-300">
                      <img src="/ACrepair.jpg" alt="AC Service" className="w-20 h-20 mb-3" />
                      <p className="text-white font-semibold text-lg">AC Service</p>
                    </div>

                    {/* Plumbing */}
                    <div className="bg-white/10 hover:scale-105 hover:bg-white/20 p-6 rounded-xl flex flex-col items-center transition-all duration-300">
                      <img src="/Taprepair.jpg" alt="Plumbing" className="w-20 h-20 mb-3" />
                      <p className="text-white font-semibold text-lg">Plumbing</p>
                    </div>

                    {/* CCTV Installation */}
                    <div className="bg-white/10 p-6 rounded-xl flex flex-col items-center transition-all duration-300">
                      <div className="w-20 h-20 overflow-hidden ">
                        <img
                          src="/CCTVrelocation.jpg"
                          alt="CCTV"
                          className="w-full h-full object-cover transform scale-125"
                        />
                      </div>
                      <p className="text-white font-semibold text-lg mt-3">CCTV Installation</p>
                    </div>


                    {/* Carpenter*/}
                    <div className="bg-white/10 hover:scale-105 hover:bg-white/20 p-6 rounded-xl flex flex-col items-center transition-all duration-300">
                      <img src="/Carpenter3.jpg" alt="Electrician" className="w-20 h-20 mb-3" />
                      <p className="text-white font-semibold text-lg">Carpenter</p>
                    </div>


                  </motion.div>
                </div>
                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 mt-36"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >

                </motion.div>

              </div>
            </div>

            {/* Bottom SVG Wave */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
                <path
                  fill="#ffffff"
                  fillOpacity="1"
                  d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,133.3C960,128,1056,96,1152,85.3C1248,75,1344,85,1392,90.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </div>
          </div>
        </div>


        {/* Services Grid */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Professional Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of home services delivered by skilled professionals to keep your home running smoothly.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full group">
                    <div className="p-6">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <Icon size={32} />
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-all duration-300">
                        {service.name}
                      </h3>

                      <p className="text-gray-600">
                        {service.shortDescription}
                      </p>
                      <Link href={service.link}>
                        <div className="mt-6 flex items-center text-blue-600 font-medium">
                          <span className="group-hover:mr-2 transition-all duration-300">Learn more</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 transform group-hover:translate-x-1 transition-all duration-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Service Details */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We deliver exceptional quality with trained professionals and guaranteed satisfaction.
            </p>
          </div>

          <div className="space-y-32">
            {services.map((service, index) => {
              const ref = React.useRef(null);
              const isInView = useInView(ref, { once: true, margin: "-100px 0px" });
              const isEven = index % 2 === 0;

              return (
                <div
                  key={service.id}
                  ref={ref}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
                >
                  <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <div className="relative">
                      <div className={`absolute -inset-4 ${isEven ? 'bg-blue-400/10' : 'bg-teal-400/10'} rounded-3xl blur-xl`}></div>
                      <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3]">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {service.name}
                    </h3>

                    <p className="text-gray-700 mb-6 text-lg">
                      {service.longDescription}
                    </p>

                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Key Benefits
                      </h4>

                      <ul className="space-y-3">
                        {service.benefits.map((benefit, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
                          >
                            <div className="flex-shrink-0 mt-1">
                              <Check className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="ml-3 text-gray-600">{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <Link href={service.link}>
                      <button
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Book {service.name}
                      </button>
                    </Link>

                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it — hear from our satisfied customers.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  className="bg-white p-8 rounded-2xl shadow-lg relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Quote className="h-12 w-12 text-blue-100 absolute -top-2 -left-2" />
                  <p className="text-gray-700 mb-6 relative z-10">"{t.content}"</p>
                  <div>
                    <h4 className="font-medium text-gray-900">{t.author}</h4>
                    <p className="text-gray-500 text-sm">{t.position}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  className="p-12 lg:p-16"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Ready to get started?
                    <span className="block mt-2">Book a service today!</span>
                  </h2>

                  <p className="text-blue-100 text-lg mb-8 max-w-lg">
                    Our professional team is ready to help you with all your home service needs.
                    Contact us today to schedule an appointment or request a free quote.
                  </p>

                  <div className="space-y-6 mb-10">
                    <div className="flex items-start">
                      <Phone className="h-6 w-6 text-blue-200 mr-4 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-white">Call us</h4>
                        <p className="text-blue-100">+91 9381145944</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-6 w-6 text-blue-200 mr-4 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-white">Working hours</h4>
                        <p className="text-blue-100">Mon - Sat: 8:00 AM - 8:00 PM</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Map className="h-6 w-6 text-blue-200 mr-4 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-white">Service area</h4>
                        <p className="text-blue-100">Metropolitan area and suburbs</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="./contact">
                      <button
                        className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-800 transition-all duration-300 shadow-sm"
                      >
                        Request Quote
                      </button>
                    </Link >
                  </div>
                </motion.div>

                <motion.div
                  className="relative lg:h-auto"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <img
                    src="contactus.jpg"
                    alt="Professional home service"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}