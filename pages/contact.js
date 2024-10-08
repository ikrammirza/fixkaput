import React from "react";
import Head from "next/head";

const Contact = () => {
  return (
    <>
      <Head>
        <title>Contact - fixkaput.com</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <div className="bg-blue-50">
        <section className="text-gray-600 body-font relative">
          <div className="container px-5 py-10 mx-auto flex flex-col md:flex-row">
            <div className="md:w-2/3 bg-gray-300 rounded-lg overflow-hidden mb-6 md:mb-0 md:mr-10 relative h-80 md:h-auto">
              <iframe
                width="100%"
                height="100%"
                className="absolute inset-0"
                frameBorder="0"
                title="map"
                marginHeight="0"
                marginWidth="0"
                scrolling="no"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d475.935979212242!2d78.44539370360077!3d17.388361057810112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb970e6570c281%3A0x25ba2f46e1761032!2sAhmed%20Cafe!5e0!3m2!1sen!2sin!4v1723825400411!5m2!1sen!2sin"
                style={{
                  filter: "grayscale(1) contrast(1.2) opacity(0.4)",
                  border: 0,
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="md:w-1/3 bg-blue-50 flex flex-col md:ml-auto w-full md:py-8  md:mt-0 shadow-lg rounded-lg p-6">
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  ADDRESS
                </h2>
                <p className="mt-1 text-sm text-gray-700">
                  12-2-174/1, Murad Nagar, Hyderabad, 500028
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  EMAIL
                </h2>
                <a className="text-indigo-500 leading-relaxed text-sm">
                  mirzaikram129@gmail.com
                </a>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h2 className="title-font font-semibold text-gray-900 text-xs">
                  PHONE
                </h2>
                <p className="leading-relaxed text-sm text-gray-700">
                  9381145944
                </p>
              </div>
              <h2 className="text-gray-900 text-2xl mb-4 mt-10 font-bold title-font">
                We'd Love to Hear From You!
              </h2>
              <p className="leading-relaxed mb-4 text-gray-600">
                Whether you have a question or just want to say hello, feel free
                to drop us a message below.
              </p>
              <div className="relative mb-4">
                <label
                  htmlFor="name"
                  className="leading-7 text-sm text-gray-600"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="email"
                  className="leading-7 text-sm text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="message"
                  className="leading-7 text-sm text-gray-600"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full bg-gray-100 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-2 px-4 resize-none leading-6 transition-colors duration-200 ease-in-out"
                ></textarea>
              </div>
              <button className="text-white bg-gradient-to-r from-blue-500 to-blue-700 border-0 py-2 px-6 focus:outline-none hover:from-blue-600 hover:to-blue-800 rounded-lg text-lg transition-all duration-200 ease-in-out">
                Send Message
              </button>

              <p className="text-xs text-gray-500 mt-3">
                We value your feedback and will get back to you shortly.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
