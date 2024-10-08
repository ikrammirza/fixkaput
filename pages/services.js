import React, { useState } from "react";
import { TbAirConditioning } from "react-icons/tb";
import { CgSmartHomeBoiler } from "react-icons/cg";
import { MdOutlineCarpenter, MdPlumbing } from "react-icons/md";
import { SiScrapbox } from "react-icons/si";
import { GiCctvCamera } from "react-icons/gi";
import Link from "next/link";
import Image from "next/image";

const Services = () => {
  const services = [
    {
      id: 1,
      name: "AC service & repair",
      description:
        "Comprehensive repair and maintenance of air conditioning systems.",
      image: "/Acservice.jpg", // Replace with your actual image path
    },
    {
      id: 2,
      name: "Geyser service & repair",
      description:
        "Expert servicing and repair solutions for all types of geysers.",
      image: "/GeyserService.jpg", // Replace with your actual image path
    },
    {
      id: 3,
      name: "Carpenter service",
      description:
        "Professional carpentry services from experienced carpenters.",
      image: "/CarpenterService.jpg", // Replace with your actual image path
    },
    {
      id: 4,
      name: "Plumbing service",
      description:
        "Reliable and affordable plumbing services for all your needs.",
      image: "/PlumbingService.jpg", // Replace with your actual image path
    },
    {
      id: 5,
      name: "Scrap collection service",
      description: "Efficient scrap collection and recycling services.",
      image: "/ScrapCollection.jpg", // Replace with your actual image path
    },
    {
      id: 6,
      name: "CCTV service & repair",
      description:
        "Secure your property with our CCTV repair and installation services.",
      image: "/CCTVService.jpg", // Replace with your actual image path
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const icons = [
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #4267b2, #0e1e3d)",
        padding: 10,
        borderRadius: 8,
      }}
    >
      <TbAirConditioning color="#C0C0C0" size={100} />
    </div>,
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #4267b2, #0e1e3d)",
        padding: 10,
        borderRadius: 8,
      }}
    >
      <CgSmartHomeBoiler color="#C0C0C0" size={100} />
    </div>,
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #4267b2, #001F4D)",
        padding: 10,
        borderRadius: 8,
      }}
    >
      <MdOutlineCarpenter color="#C0C0C0" size={100} />
    </div>,
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #4267b2, #001F4D)",
        padding: 10,
        borderRadius: 8,
      }}
    >
      <MdPlumbing color="#C0C0C0" size={100} />
    </div>,
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #4267b2, #001F4D)",
        padding: 10,
        borderRadius: 8,
      }}
    >
      <SiScrapbox color="#C0C0C0" size={100} />
    </div>,
    <div
      style={{
        backgroundImage: "linear-gradient(to right, #4267b2, #001F4D)",
        padding: 10,
        borderRadius: 8,
      }}
    >
      <GiCctvCamera color="#C0C0C0" size={100} />
    </div>,
  ];

  return (
    <>
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-900 rounded-xl shadow-lg mx-4 md:mx-20 mt-5 md:mt-0 overflow-hidden mb-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-700 to-indigo-900 "></div>
        <div className="p-8 md:p-12">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Get home services
            </h2>
            <p className="text-lg md:text-xl text-white mt-2">
              At your doorstep from highly trained professionals, at the best
              reasonable price!!
            </p>
          </div>
          <div className="w-16 h-px bg-white mx-auto mb-8"></div>
          <div className="text-center text-white">
            <p className="text-lg md:text-xl font-medium">
              We offer a wide range of services including plumbing, electrical
              work, carpentry, and more.
            </p>
            <p className="text-lg md:text-xl font-medium">
              Contact us today to schedule an appointment!
            </p>
          </div>
        </div>
      </div>
      <div className="md:mt-28 mt-20">
        <div id="servicesSection" className="text-center subTopic">
          Services we offer
        </div>
        <div className="text-center rounded-xl border-gray-400 border md:ml-20 md:mr-20 mx-4 mt-7 md:mt-14 md:mb-32 mb-20 text-2xl font-semibold ">
          <div className="mt-5 flex flex-wrap text-xl md:text-xl lg:text-3xl">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 mb-8 md:mb- md:pt-10"
              >
                <div
                  className="flex flex-col items-center p-5 md:p-7 group"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={`/service${service.id}`}
                    className="bg-[#c0c0c0bb] hover:bg-gray-400 rounded-md p-3 md:p-2"
                  >
                    <div>{icons[index]}</div>
                  </Link>
                  <Link
                    href={`/service${service.id}`}
                    className="pt-4 md:pt-4 text-2xl font-semibold text-left relative group-hover:after:content-[''] group-hover:after:block group-hover:after:w-full group-hover:after:h-[1px] group-hover:after:bg-neutral-600 group-hover:after:absolute group-hover:after:left-0 group-hover:after:bottom-0 group-hover:after:transition-width group-hover:after:duration-100"
                  >
                    {service.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-12 ">
        <div className="container mx-auto px-4">
          {/* AC Service & Repair */}
          <div className="flex items-center mb-12 flex-row">
            <div className="flex-1">
              <Image
                src="/Acservice.jpg"
                alt="AC service & repair"
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 p-6">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                AC service & repair
              </h3>
              <p className="text-lg text-gray-700">
                Our AC service and repair team offers comprehensive solutions
                for all your air conditioning needs. Whether it's routine
                maintenance, emergency repairs, or a complete system overhaul,
                our skilled technicians ensure your AC system operates
                efficiently and effectively. We use the latest tools and
                techniques to address any issues and guarantee a comfortable
                indoor climate year-round.
              </p>
            </div>
          </div>

          {/* Geyser Service & Repair */}
          <div className="flex items-center mb-12 flex-row-reverse">
            <div className="flex-1">
              <Image
                src="/Acservice.jpg"
                alt="Geyser service & repair"
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 p-6">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Geyser service & repair
              </h3>
              <p className="text-lg text-gray-700">
                Our geyser service and repair experts provide prompt and
                reliable solutions for all types of geysers. From fixing leaks
                and addressing heating issues to performing routine maintenance,
                we ensure your geyser operates at peak performance. Our goal is
                to provide you with hot water when you need it, with minimal
                disruption to your daily routine.
              </p>
            </div>
          </div>

          {/* Carpenter Service */}
          <div className="flex items-center mb-12 flex-row">
            <div className="flex-1">
              <Image
                src="/Acservice.jpg"
                alt="Carpenter service"
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 p-6">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Carpenter service
              </h3>
              <p className="text-lg text-gray-700">
                Our professional carpenters offer a wide range of services,
                including custom woodwork, furniture repair, and installation of
                cabinets and shelves. With years of experience, we bring
                precision and craftsmanship to every project. Whether you need
                repairs or new installations, our team is dedicated to
                delivering high-quality results tailored to your needs.
              </p>
            </div>
          </div>

          {/* Plumbing Service */}
          <div className="flex items-center mb-12 flex-row-reverse">
            <div className="flex-1">
              <Image
                src="/Acservice.jpg"
                alt="Plumbing service"
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 p-6">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Plumbing service
              </h3>
              <p className="text-lg text-gray-700">
                Our plumbing service covers everything from minor leaks to major
                repairs and installations. We handle all plumbing issues with
                expertise and efficiency, ensuring that your plumbing system
                functions smoothly. Our services include pipe repairs, fixture
                installations, and emergency plumbing solutions, all designed to
                keep your home in top shape.
              </p>
            </div>
          </div>

          {/* Scrap Collection Service */}
          <div className="flex items-center mb-12 flex-row">
            <div className="flex-1">
              <Image
                src="/Acservice.jpg"
                alt="Scrap collection service"
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 p-6">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Scrap collection service
              </h3>
              <p className="text-lg text-gray-700">
                Our scrap collection service provides an efficient way to
                dispose of unwanted materials and waste. We handle all types of
                scrap, including metal, plastic, and electronic waste, and
                ensure it is recycled or disposed of properly. Our goal is to
                make scrap removal simple and environmentally friendly, helping
                you keep your space clean and clutter-free.
              </p>
            </div>
          </div>

          {/* CCTV Service & Repair */}
          <div className="flex items-center mb-12 flex-row-reverse">
            <div className="flex-1">
              <Image
                src="/Acservice.jpg"
                alt="CCTV service & repair"
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 p-6">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                CCTV service & repair
              </h3>
              <p className="text-lg text-gray-700">
                Our CCTV service and repair team specializes in installing and
                maintaining surveillance systems to enhance the security of your
                property. We offer a range of services, including camera
                installation, system upgrades, and troubleshooting. Our goal is
                to provide you with reliable and effective surveillance
                solutions to keep your premises secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
