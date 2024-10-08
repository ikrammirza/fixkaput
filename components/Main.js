import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Slider from "react-slick";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const Main = () => {
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
  const carouselImages = [
    "/Acservice.jpg",
    "/Acservice.jpg",
    "/Acservice.jpg",
    "/Acservice.jpg",
  ];
  const NextArrow = ({ onClick }) => {
    return (
      <div
        className="absolute top-1/2 right-4 transform -translate-y-1/2  text-blue-400  p-2 rounded-full cursor-pointer  hover:text-blue-700"
        onClick={onClick}
      >
        <MdArrowForwardIos size={20} />
      </div>
    );
  };
  const PrevArrow = ({ onClick }) => {
    return (
      <div
        className="absolute top-1/2 left-4 transform -translate-y-1/2  text-blue-400 p-2 rounded-full cursor-pointer  hover:text-blue-700 "
        onClick={onClick}
      >
        <MdArrowBackIos size={20} />
      </div>
    );
  };
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Automatic sliding
    autoplaySpeed: 1500,
    pauseOnHover: false, // Disable pause on hover
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <div className="mx-4 mt-5 md:ml-20 md:mr-20 rounded-xl overflow-hidden">
        {/* Carousel Section */}
        <Slider {...settings} className="mb-8">
          {carouselImages.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`carousel-${index}`}
                className="w-full md:h-[80vh] h-[50vh] object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="md:mt-20 mt-5">
        <div className="mx-4 md:ml-20 md:mr-20 border rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className=" w-full md:w-2/3 grid grid-cols-2 gap-4 bg-gray-300 p-4 md:p-0 hidden md:grid">
              {services.slice(0, 4).map((service, index) => (
                <div
                  key={service.id}
                  className="relative overflow-hidden bg-cover bg-no-repeat"
                >
                  <Link href={`image${index + 1}_url`}>
                    <img
                      src={`/Acservice.jpg`}
                      alt={`img ${index + 1}`}
                      width={500}
                      height={300}
                      className="w-full transition duration-300 ease-in-out hover:scale-110"
                    />
                  </Link>
                </div>
              ))}
            </div>

            {/* Text Section */}
            <div className="w-full md:w-1/3 bg-gradient-to-r from-blue-600 to-blue-900 text-white flex items-center justify-center p-6 rounded-lg">
              {/* Centered text with padding */}
              <div className="text-center">
                <div className="rounded-full animate-bounce bg-yellow-400 h-32 w-32 md:h-40 md:w-40 flex items-center justify-center mx-auto mt-3 mb-2 md:mb-6 shadow-lg transform transition duration-300 ease-in-out hover:scale-110">
                  <span className="text-4xl md:text-5xl text-white font-bold">
                    30%
                  </span>
                  <span className="text-lg md:text-2xl text-gray-800 ml-1 md:ml-2">
                    OFF
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                  Exclusive Offer!
                </h2>
                <p className="text-base md:text-xl mb-4 md:mb-6">
                  Limited time offer! Get 30% off on your first service.
                </p>
                <Link href="/services">
                  <button className="text-left border-2 border-black bg-white text-blue-400 px-4 py-2 md:px-6 md:py-3 font-serif text-lg rounded-lg hover:bg-blue-400 hover:text-white transition duration-300 ease-in-out hover:shadow-lg">
                    Explore now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 md:mt-28">
        <div className="subTopic">Hot Fixes</div>

        <section className="text-gray-600 body-font">
          <div className="container px-2 md:py-10  mb-10 mx-auto">
            <div className="flex flex-nowrap md:flex-wrap -m-4 overflow-x-scroll md:overflow-x-visible whitespace-nowrap md:whitespace-normal">
              <div className="p-4 md:w-1/4 flex-shrink-0">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out md:hover:scale-105">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src="/Acservice.jpg"
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-sm title-font font-medium text-gray-400 mb-1">
                      CCTV services
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Repairing of Closed-Circuit Television (CCTV)
                    </h1>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/4 flex-shrink-0">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out md:hover:scale-105">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src="/Acservice.jpg"
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-sm title-font font-medium text-gray-400 mb-1">
                      CCTV services
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Repairing of Closed-Circuit Television (CCTV)
                    </h1>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/4 flex-shrink-0">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out md:hover:scale-105">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src="/Acservice.jpg"
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-sm title-font font-medium text-gray-400 mb-1">
                      CCTV services
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Repairing of Closed-Circuit Television (CCTV)
                    </h1>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/4 flex-shrink-0">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out md:hover:scale-105">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src="/Acservice.jpg"
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-sm title-font font-medium text-gray-400 mb-1">
                      CCTV services
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Repairing of Closed-Circuit Television (CCTV)
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16 md:mt-28">
        <div className="subTopic">Hot Fixes</div>

        <section className="text-gray-600 body-font">
          <div className="container px-2 md:py-10 mb-10 mx-auto">
            <div className="flex flex-nowrap md:flex-wrap -m-4 overflow-x-scroll md:overflow-x-visible whitespace-nowrap md:whitespace-normal">
              <div className="p-4 md:w-1/4 flex-shrink-0">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out md:hover:scale-105">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src="/Acservice.jpg"
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-sm title-font font-medium text-gray-400 mb-1">
                      CCTV services
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Repairing of Closed-Circuit Television (CCTV)
                    </h1>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/4 flex-shrink-0">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out md:hover:scale-105">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src="/Acservice.jpg"
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-sm title-font font-medium text-gray-400 mb-1">
                      CCTV services
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Repairing of Closed-Circuit Television (CCTV)
                    </h1>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/4 flex-shrink-0">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out md:hover:scale-105">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src="/Acservice.jpg"
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-sm title-font font-medium text-gray-400 mb-1">
                      CCTV services
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Repairing of Closed-Circuit Television (CCTV)
                    </h1>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/4 flex-shrink-0">
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out md:hover:scale-105">
                  <img
                    className="lg:h-48 md:h-36 w-full object-cover object-center"
                    src="/Acservice.jpg"
                    alt="blog"
                  />
                  <div className="p-6">
                    <h2 className="tracking-widest text-sm title-font font-medium text-gray-400 mb-1">
                      CCTV services
                    </h2>
                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                      Repairing of Closed-Circuit Television (CCTV)
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className=" mt-16 mx-4 md:mx-20 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-5xl font-bold mb-6 text-center">Why Choose Us?</h2>
        <ul className="list-disc list-inside space-y-4">
          <li className="py-2 flex text-xl items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8.5l3.5 3.5L12 15.5 8.5 12l3.5-3.5z"></path>
              <path d="M21 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
            </svg>
            Same day service, all days a week
          </li>
          <li className="py-2 flex text-xl items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8.5l3.5 3.5L12 15.5 8.5 12l3.5-3.5z"></path>
              <path d="M21 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
            </svg>
            Great customer service experience
          </li>
          <li className="py-2 flex text-xl items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8.5l3.5 3.5L12 15.5 8.5 12l3.5-3.5z"></path>
              <path d="M21 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
            </svg>
            Reasonable pricing with no hidden charges
          </li>
          <li className="py-2 flex text-xl items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8.5l3.5 3.5L12 15.5 8.5 12l3.5-3.5z"></path>
              <path d="M21 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
            </svg>
            Ensuring customers and technicians safety is our topmost priority
          </li>
          <li className="py-2 flex text-xl items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8.5l3.5 3.5L12 15.5 8.5 12l3.5-3.5z"></path>
              <path d="M21 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
            </svg>
            90 days service warranty
          </li>
          <li className="py-2 flex text-xl items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8.5l3.5 3.5L12 15.5 8.5 12l3.5-3.5z"></path>
              <path d="M21 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
            </svg>
            Quick quality support
          </li>
          <li className="py-2 flex text-xl items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8.5l3.5 3.5L12 15.5 8.5 12l3.5-3.5z"></path>
              <path d="M21 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
            </svg>
            Background verified and skilled technicians with good industry
            experience
          </li>
          <li className="py-2 flex text-xl items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8.5l3.5 3.5L12 15.5 8.5 12l3.5-3.5z"></path>
              <path d="M21 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
            </svg>
            Highly customer focused
          </li>
          <li className="py-2 flex text-xl items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400 mr-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8.5l3.5 3.5L12 15.5 8.5 12l3.5-3.5z"></path>
              <path d="M21 12c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z"></path>
            </svg>
            Online/Cash payments are accepted
          </li>
        </ul>
      </div>
    </>
  );
};

export default Main;
