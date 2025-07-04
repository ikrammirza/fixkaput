import React from "react";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const services = [
  {
    id: "pest-101",
    name: "Cockroach Control",
    description: "Eliminate cockroach infestations using safe & effective methods.",
    price: 399,
  },
  {
    id: "pest-102",
    name: "Termite Treatment",
    description: "Protect your home from destructive termites with advanced solutions.",
    price: 1199,
  },
  {
    id: "pest-103",
    name: "Bed Bug Treatment",
    description: "Complete eradication of bed bugs from beds, sofas, and mattresses.",
    price: 899,
  },
  {
    id: "pest-104",
    name: "General Pest Control",
    description: "Overall pest management for ants, lizards, spiders, and more.",
    price: 699,
  },
];

const detailedServices = [
  {
    id: "pest-101",
    name: "Cockroach Control",
    description: [
      "Targeted gel and spray treatment in kitchen and bathroom areas.",
      "Odorless and safe for children and pets.",
      "Long-lasting results with deep infestation control.",
    ],
    price: 399,
    image: "cockroach-control.jpg",
  },
  {
    id: "pest-102",
    name: "Termite Treatment",
    description: [
      "Anti-termite drilling and chemical injection for wood and walls.",
      "Comprehensive protection from current and future infestations.",
      "Includes both pre and post-construction treatment options.",
    ],
    price: 1199,
    image: "termite-control.jpg",
  },
  {
    id: "pest-103",
    name: "Bed Bug Treatment",
    description: [
      "Advanced spray and heat treatment on mattresses and upholstery.",
      "Two-phase approach to break breeding cycles.",
      "Assured relief from bites and rashes.",
    ],
    price: 899,
    image: "bed-bugs.jpg",
  },
  {
    id: "pest-104",
    name: "General Pest Control",
    description: [
      "Covers common household pests like ants, spiders, and lizards.",
      "Wall spray and surface dusting with eco-safe chemicals.",
      "Monthly or quarterly maintenance plans available.",
    ],
    price: 699,
    image: "general-pest.jpg",
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
      progress: undefined,
      theme: "colored",
    });
  };

  return (
    <>
      <Head>
        <title>fixKaput | pest Control</title>
      </Head>
      <ToastContainer
        toastStyle={{ backgroundColor: "#1e88e5" }}
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="md:mx-20 scroll-smooth">
        {/* Services Section */}
        <div className="flex flex-col mt-8 md:mt-10 md:flex-row md:space-x-4">
          <div className="flex flex-wrap justify-center mb-10 md:mb-0 w-full md:w-1/3">
            <div className="bg-white shadow-lg rounded-lg p-4 w-full">
              <h2 className="rounded-xl mb-5 font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-white py-4 text-center text-3xl md:text-4xl">
                Pest Control Services
              </h2>
              <div className="flex flex-wrap justify-center">
                {detailedServices.map((service) => (
                  <div key={service.id} className="flex flex-col items-center w-1/2 p-4">
                    <a href={`#${service.name.replace(/\s+/g, "-").toLowerCase()}`}>
                      <img
                        src={service.image}
                        alt={service.name}
                        className="rounded-lg w-full h-32 object-cover mb-2 hover:scale-105 transition-transform duration-300 shadow-lg"
                      />
                    </a>
                    <a
                      href={`#${service.name.replace(/\s+/g, "-").toLowerCase()}`}
                      className="text-lg font-semibold text-center text-blue-600 hover:underline"
                    >
                      {service.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="w-full mt-5 md:mt-0 md:w-2/3 flex flex-col">
            <Carousel
              className="ml-4 mr-4 md:mr-0"
              showArrows={true}
              showStatus={false}
              showThumbs={false}
              infiniteLoop={true}
              autoPlay={true}
              interval={1500}
              stopOnHover={true}
              transitionTime={500}
            >
              {detailedServices.map((service) => (
                <div key={service.id}>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="object-cover w-full h-[400px] md:h-[500px] rounded-lg shadow-md"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Detailed Service Section */}
        <section className="py-12 md:mt-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-12">
              Pest Control & Prevention
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {detailedServices.map((service) => (
                <div
                  key={service.id}
                  id={service.name.replace(/\s+/g, "-").toLowerCase()}
                  className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="block md:hidden w-full md:w-48 h-48 object-cover rounded-md md:rounded-none md:rounded-l-lg mb-0"
                  />
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-semibold text-blue-600 mb-4">
                      {service.name}
                    </h3>
                    <ul className="list-disc ml-6 mb-6 text-gray-600 space-y-2">
                      {service.description.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                    <div className="flex items-center md:pl-4 justify-between">
                      <p className="text-gray-500 text-lg">₹{service.price}</p>
                      <button
                        onClick={() => {
                          addToCart(service.id.toString(), 1, service.price, service.name);
                          handleCart(service.name);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-lg transition duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <img
                    src={service.image}
                    alt={service.name}
                    className="hidden md:block w-full md:w-48 h-36 object-cover rounded-md md:rounded-none md:rounded-l-lg mb-4 md:mb-0 md:mt-2 md:mr-2"
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
