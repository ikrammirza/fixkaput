import React from "react";
import Head from "next/head";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const About = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500, // Adjust the speed as needed
    arrows: false, // Hide arrows if only using dots
    pauseOnHover: true, // Optional: Pause on hover
  };

  return (
    <>
      <Head>
        <title>fixKaput | Abouts Us</title>
      </Head>
      <div className="bg-blue-50 min-h-screen">
        {/* Intro Section */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-6 sm:px-4 lg:px-12 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
                fixkaput.com
              </span>
            </h1>
            <p className="text-gray-700 text-base sm:text-lg mb-8">
              Your one-stop solution for all your service needs. From AC
              servicing to plumbing and more, we’re here to help.
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mx-6 md:mx-20 bg-blue-100 py-16 sm:px-4">
          <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 w-full mb-8 lg:mb-0 lg:pr-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                At fixkaput.com, our mission is to simplify and enhance the
                maintenance of your home and business. We offer a comprehensive
                range of services, including AC repairs, plumbing, electrical
                work, CCTV installation, and scrap collection. Our goal is to
                deliver top-quality, reliable services that meet your specific
                needs.
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We envision a future where our platform becomes synonymous with
                trust and excellence in service delivery. By continuously
                innovating and improving our offerings, we aim to set new
                standards in the industry and be the preferred choice for all
                service-related needs.
              </p>
            </div>
            <div className="lg:w-1/2 w-full">
              <Slider {...settings} className="rounded-lg overflow-hidden">
                <div>
                  <img
                    className="w-full h-60 sm:h-80 object-cover"
                    alt="Mission"
                    src="/ACinstallation.jpg"
                  />
                </div>
                <div>
                  <img
                    className="w-full h-60 sm:h-80 object-cover"
                    alt="Mission"
                    src="/CCTVinstallation.jpeg"
                  />
                </div>
                <div>
                  <img
                    className="w-full h-60 sm:h-80 object-cover"
                    alt="Mission"
                    src="/Carpenter3.jpg"
                  />
                </div>
              </Slider>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 w-full mb-8 lg:mb-0 lg:pr-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-6">
                <li>
                  <strong>Integrity:</strong> We maintain the highest ethical
                  standards in all our interactions. Our team operates
                  transparently and honestly, building trust with every service
                  we provide.
                </li>
                <li>
                  <strong>Reliability:</strong> Our team is dependable, ensuring
                  timely and effective service. We are committed to being
                  punctual and consistent, delivering on our promises every
                  time.
                </li>
                <li>
                  <strong>Customer Satisfaction:</strong> We put our customers
                  at the heart of everything we do. By actively listening to
                  feedback and continuously improving our services, we ensure
                  that every interaction exceeds expectations and delivers a
                  truly positive experience.
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full">
              <Slider {...settings} className="rounded-lg overflow-hidden">
                <div>
                  <img
                    className="w-full h-60 sm:h-80 object-cover"
                    alt="Values"
                    src="/ACrepair.jpg"
                  />
                </div>
                <div>
                  <img
                    className="w-full h-60 sm:h-80 object-cover"
                    alt="Values"
                    src="/wiring.jpg"
                  />
                </div>
                <div>
                  <img
                    className="w-full h-60 sm:h-80 object-cover"
                    alt="Values"
                    src="/Bathroomfittinginstallation.jpg"
                  />
                </div>
              </Slider>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="mx-6 md:mx-20 bg-blue-100 py-16 sm:px-4">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience the Best Service?
            </h2>
            <p className="text-gray-700 mb-6">
              Contact us today to schedule a service or learn more about how we
              can assist you with your needs.
            </p>
            <a
              href="/contact"
              className="text-white bg-gradient-to-r from-blue-500 to-blue-700 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded-lg text-lg"
            >
              Get in Touch
            </a>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-blue-50 py-20">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Us?
            </h2>
            <div className="flex flex-wrap justify-center">
              <div className="p-4 lg:w-1/4 md:w-1/2">
                <div className="h-full bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-3 relative">
                    <span className="relative text-blue-500 inline-block">
                      Expert Technicians
                      <span
                        className="absolute bottom-0 left-0 right-0 h-px bg-black"
                        style={{ bottom: "-2px" }}
                      />
                    </span>
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    Our team consists of highly trained professionals who bring
                    expertise and care to every job.
                  </p>
                </div>
              </div>
              <div className="p-4 lg:w-1/4 md:w-1/2">
                <div className="h-full bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-3 relative">
                    <span className="relative text-blue-500 inline-block">
                      Reliable Service
                      <span
                        className="absolute bottom-0 left-0 right-0 h-px bg-black"
                        style={{ bottom: "-2px" }}
                      />
                    </span>
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    We guarantee on-time service, ensuring that our customers
                    can rely on us whenever they need help.
                  </p>
                </div>
              </div>
              <div className="p-4 lg:w-1/4 md:w-1/2">
                <div className="h-full bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-3 relative">
                    <span className="relative text-blue-500 inline-block">
                      Affordable Pricing
                      <span
                        className="absolute bottom-0 left-0 right-0 h-px bg-black"
                        style={{ bottom: "-2px" }}
                      />
                    </span>
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    Our competitive pricing model ensures you get the best value
                    for quality services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
