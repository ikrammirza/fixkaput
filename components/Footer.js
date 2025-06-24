// import React from "react";
// import Image from "next/legacy/image";

// const Footer = () => {
//   return (
//     <footer className="bg-[#f5f5f5] text-gray-800 py-8 mt-20">
//       <div className="container mx-auto px-6 flex flex-col lg:flex-row lg:justify-between">
//         {/* Brand Section */}

//         <a className=" text-gray-800 hover:text-[#2b6cb0]  ">
//           <Image src="/fklogo.png" alt="Logo" width={50} height={50} />
//           <span className="brandName  font-bold text-lg ">fixKaput</span>
//         </a>

//         {/* Navigation Links */}
//         <div className="flex flex-wrap lg:w-2/3 mb-8  lg:mb-0">
//           <div className="w-full lg:w-1/4 px-4 mb-6 mt-7 md:mt-0 lg:mb-0">
//             <h2 className="text-xl font-semibold mb-4 text-[#2b6cb0]">
//               Company
//             </h2>
//             <ul className="space-y-2">
//               <li>
//                 <a
//                   href="#"
//                   className="hover:text-[#2b6cb0] transition duration-300"
//                 >
//                   About Us
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="hover:text-[#2b6cb0] transition duration-300"
//                 >
//                   Terms & Conditions
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="hover:text-[#2b6cb0] transition duration-300"
//                 >
//                   Privacy Policy
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div className="w-full lg:w-1/4 px-4 mb-6 lg:mb-0">
//             <h2 className="text-xl font-semibold mb-4 text-[#2b6cb0]">
//               For Customers
//             </h2>
//             <ul className="space-y-2">
//               <li>
//                 <a
//                   href="#"
//                   className="hover:text-[#2b6cb0] transition duration-300"
//                 >
//                   Services Near You
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="hover:text-[#2b6cb0] transition duration-300"
//                 >
//                   Reviews
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   className="hover:text-[#2b6cb0] transition duration-300"
//                 >
//                   Contact Us
//                 </a>
//               </li>
//             </ul>
//           </div>
//           <div className="w-full lg:w-1/4 px-4 mb-6 lg:mb-0">
//             <h2 className="text-xl font-semibold mb-4 text-[#2b6cb0]">
//               For Partners
//             </h2>
//             <ul className="space-y-2">
//               <li>
//                 <a
//                   href="/technicianLogin"
//                   className="hover:text-[#2b6cb0] transition duration-300"
//                 >
//                   Sign In 
//                 </a>
//               </li>
//               </ul>
//               </div>
//           <div className="w-full lg:w-1/4 px-4">
//             <h2 className="text-xl font-semibold mb-4 text-[#2b6cb0]">
//               Follow Us
//             </h2>
//             <div className="flex space-x-4">
//               <a
//                 href="#"
//                 className="text-gray-600 hover:text-[#2b6cb0] transition duration-300"
//               >
//                 <svg
//                   fill="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   className="w-6 h-6"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
//                 </svg>
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-600 hover:text-[#2b6cb0] transition duration-300"
//               >
//                 <svg
//                   fill="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   className="w-6 h-6"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
//                 </svg>
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-600 hover:text-[#2b6cb0] transition duration-300"
//               >
//                 <svg
//                   fill="none"
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   className="w-6 h-6"
//                   viewBox="0 0 24 24"
//                 >
//                   <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
//                   <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
//                 </svg>
//               </a>
//               <a
//                 href="#"
//                 className="text-gray-600 hover:text-[#2b6cb0] transition duration-300"
//               >
//                 <svg
//                   fill="currentColor"
//                   stroke="currentColor"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="0"
//                   className="w-6 h-6"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     stroke="none"
//                     d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
//                   ></path>
//                   <circle cx="4" cy="4" r="2" stroke="none"></circle>
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Star,
  Shield,
  Award,
  Users
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    "AC Services",
    "Geyser Services", 
    "Plumbing Services",
    "Electrician Services",
    "Scrap Services",
    "CCTV Services"
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/story" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" }
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Service Areas", href: "/areas" },
    { name: "Emergency Service", href: "/emergency" }
  ];

  const legalLinks = [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Service Agreement", href: "/agreement" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-32">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Image src="/fklogo.png" alt="FixKaput Logo" width={32} height={32} />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                  FixKaput
                </h1>
                <p className="text-xs text-gray-300 font-medium">Professional Services</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for professional home services. We connect you with skilled technicians 
              for all your repair and maintenance needs.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">4.8/5 Rating</p>
                  <p className="text-xs text-gray-400">10k+ Reviews</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Verified</p>
                  <p className="text-xs text-gray-400">Technicians</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-sm">+91-XXXXX-XXXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-sm">support@fixkaput.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm">24/7 Emergency Service</span>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link 
                    href={`/services/${service.toLowerCase().replace(/\s+/g, '-').replace('services', '').trim()}`}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">Same Day Service</span>
              </div>
              <p className="text-xs text-gray-400">Book today, get service today!</p>
            </div>
          </div>

          {/* Company & Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Company</h3>
            <ul className="space-y-3 mb-8">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Legal</h3>
            <ul className="space-y-3 mb-8">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* For Partners */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-white">For Partners</h3>
              <Link 
                href="/technicianLogin"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm"
              >
                <Users className="w-4 h-4" />
                <span>Join as Technician</span>
              </Link>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Follow Us</h3>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600/20 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 text-blue-400 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-sky-500/20 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                >
                  <Twitter className="w-5 h-5 text-sky-400 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-500/20 hover:bg-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-pink-400 group-hover:text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-700/20 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 group"
                >
                  <Linkedin className="w-5 h-5 text-blue-400 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-sm text-gray-400">
                © {currentYear} FixKaput. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">Serving 50+ Cities</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">1000+ Technicians</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Service Available</span>
              </div>
              <div className="text-xs text-gray-400">
                Made with ❤️ in India
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;