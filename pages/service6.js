import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const services = [
  {
    id: 1,
    name: "AC Repair",
    description:
      "Comprehensive repair and maintenance of air conditioning systems.",
  },
  {
    id: 2,
    name: "AC Service",
    description:
      "Expert servicing and repair solutions for all types of geysers.",
  },
  {
    id: 3,
    name: "Install & Uninstall",
    description: "Professional carpentry services from experienced carpenters.",
  },
  {
    id: 4,
    name: "AC Gas Refill",
    description:
      "Reliable and affordable plumbing services for all your needs.",
  },
];

const ServicePage = ({ cart, addToCart }) => {
  const handleCart = (item) => {
    toast.success(`${item} added`, {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar
      />
      <div className=" md:mx-20 ">
        {/* Header Section */}

        {/* Services Section */}
        <div className="flex flex-col mt-8 md:mt-10 md:flex-row md:space-x-4">
          {/* Service Links */}
          <div className="flex flex-wrap justify-center mb-10 md:mb-0 w-full md:w-1/3">
            <div className="bg-white shadow-lg rounded-lg p-4 w-full">
              <h2 className="rounded-xl mb-5  font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-white py-4 text-center text-3xl md:text-4xl">
                CCTV Service & Repair
              </h2>
              {/* Box wrapper for services */}
              <div className="flex flex-wrap justify-center">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col items-center w-1/2 p-4"
                  >
                    <Link href={`/service/${service.id}`}>
                      <img
                        src={`/Acservice.jpg`}
                        alt={service.name}
                        className="rounded-lg w-full h-32 object-cover mb-2 hover:scale-105 transition-transform duration-300 shadow-lg"
                      />
                    </Link>
                    <Link
                      href={`/service/${service.id}`}
                      className="text-lg font-semibold text-center text-blue-600 hover:underline"
                    >
                      {service.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="w-full mt-5 md:mt-0 md:w-2/3 flex flex-col">
            <Carousel
              className="ml-4 mr-4 md:mr-0 "
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={1500}
              stopOnHover={true}
              transitionTime={500}
            >
              <div>
                <img
                  src="Acservice.jpg"
                  alt="Slide 1"
                  className="object-cover w-full h-[400px] md:h-[500px] rounded-lg shadow-md"
                />
              </div>
              <div>
                <img
                  src="Acservice.jpg"
                  alt="Slide 2"
                  className="object-cover w-full h-[400px] md:h-[500px] rounded-lg shadow-md"
                />
              </div>
              <div>
                <img
                  src="Acservice.jpg"
                  alt="Slide 3"
                  className="object-cover w-full h-[400px] md:h-[500px] rounded-lg shadow-md"
                />
              </div>
            </Carousel>
          </div>
        </div>

        {/* Install & Uninstall Section */}
        <section className="py-12 md:mt-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-center text-blue-700  mb-12">
              AC Repair & Service
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {/* Service Card */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src="Acservice.jpg"
                    alt="Service"
                    className="block md:hidden w-full md:w-48 h-48 object-cover rounded-md md:rounded-none md:rounded-l-lg mb-0"
                  />

                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4">
                      Refrigerant Leak Detection and Repair
                    </h3>
                    <ul className="list-disc ml-6 mb-6 text-gray-600 space-y-2">
                      <li>Involves inspecting the system.</li>
                      <li>Testing components.</li>
                      <li>
                        Technicians locate leaks and recharge the system with
                        the correct amount of refrigerant.
                      </li>
                    </ul>
                    <div className="flex items-center md:pl-4 justify-between">
                      <p className="text-gray-500 text-lg">₹420</p>
                      <button
                        onClick={() => {
                          addToCart("serviceItem", 1, 400, "Service");
                          handleCart("Refrigerant Leak Detection and Repair");
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg transition duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <img
                    src="Acservice.jpg"
                    alt="Service"
                    className="hidden md:block  w-full md:w-48 h-36 object-cover rounded-md md:rounded-none md:rounded-l-lg mb-4 md:mb-0 md:mt-2 md:mr-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicePage;
