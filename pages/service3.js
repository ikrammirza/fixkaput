import React from "react";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const services = [
  {
    id: 1,
    name: "CCTV Installation",
    description: "Professional installation of security cameras at homes or offices.",
  },
  {
    id: 2,
    name: "CCTV Repair",
    description: "Repairing faulty CCTV units, cables, and DVR/NVR systems.",
  },
  {
    id: 3,
    name: "CCTV Maintenance",
    description: "Regular health check-ups and servicing of CCTV systems.",
  },
  {
    id: 4,
    name: "CCTV Relocation",
    description: "Uninstalling and reinstalling CCTV systems to new locations.",
  },
];

const detailedServices = [
  {
    id: 101,
    name: "CCTV Installation",
    description: [
      "Mounting cameras at strategic points for maximum coverage.",
      "Connecting cameras to DVR/NVR and ensuring recording setup.",
      "Power and internet configuration for real-time monitoring.",
    ],
    price: 899,
    image: "cctv.jpg",
  },
  {
    id: 102,
    name: "CCTV Repair",
    description: [
      "Fixing signal loss, blurry footage, or disconnected cameras.",
      "Repairing damaged power cables, connectors, or hard drives.",
      "Restoring live view and playback functionality.",
    ],
    price: 599,
    image: "cctv.jpg",
  },
  {
    id: 103,
    name: "CCTV Maintenance",
    description: [
      "Lens cleaning, wire inspection, and DVR/NVR health check.",
      "Ensuring proper recording, date/time sync, and storage health.",
      "Testing camera angles and motion detection sensitivity.",
    ],
    price: 499,
    image: "cctv.jpg",
  },
  {
    id: 104,
    name: "CCTV Relocation",
    description: [
      "Safe removal of existing CCTV setup from old premises.",
      "Reinstallation at new location with optimized placement.",
      "Wiring, testing, and remote access configuration.",
    ],
    price: 699,
    image: "cctv.jpg",
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
        <title>fixKaput | CCTV Services</title>
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
                CCTV Services
              </h2>
              <div className="flex flex-wrap justify-center">
                {detailedServices.map((service) => (
                  <div key={service.id} className="flex flex-col items-center w-1/2 p-4">
                    <a href={`#${service.name.replace(/\s+/g, "-").toLowerCase()}`}>
                      <img
                        src={`/cctv.jpg`}
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
              CCTV Installation & Repair
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
