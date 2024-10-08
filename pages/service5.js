import React from 'react'


import { FaShoppingCart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/legacy/image";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";



import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const services = [
  { id: 1, name: 'AC Repair', description: 'Comprehensive repair and maintenance of air conditioning systems.' },
  { id: 2, name: 'AC Service', description: 'Expert servicing and repair solutions for all types of geysers.' },
  { id: 3, name: 'Install & Uninstall', description: 'Professional carpentry services from experienced carpenters.' },
  { id: 4, name: 'AC Gas Refill', description: 'Reliable and affordable plumbing services for all your needs.' }

];



const service1 = ({addToCart}) => {
 
  return <>

    <div className='flex items-center'>
      <div className='ml-20 mt-10'>
        {/*this is section 1*/}
        <div className='rounded-xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 text-white pl-8 py-4 md:py-5 text-4xl md:text-4xl '>AC Service & Repair</div>
        <div>
          <div className="text-center rounded-xl border-gray-400 border mt-4 md:mt-10  text-2xl font-semibold">
            <div className=" flex flex-wrap text-xl md:text-xl ">
              {services.map((service, index) => (
                <div key={service.id} className="sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-7 md:mt-10">
                  <div className="flex flex-col items-center justify-between transition duration-100 relative group">
                    <Link
                      href={`/service${service.id}`}
                      className="bg-[#c0c0c0bb] hover:bg-gray-400 rounded-md p-1 block">

                      <img src={`/Acservice.jpg`} alt={`img ${index + 1}`} width={200} height={100} className="rounded-lg" />

                    </Link>
                    <Link
                      href={`/service${service.id}`}
                      className="pt-5 md:pt-4 text-xl font-semibold text-left relative group-hover:after:content-[''] group-hover:after:block group-hover:after:w-full group-hover:after:h-[1px] group-hover:after:bg-neutral-600 group-hover:after:absolute group-hover:after:left-0 group-hover:after:bottom-0 group-hover:after:transition-width group-hover:after:duration-100">

                      {service.name}

                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>

      <div>
        <Carousel className='ml-20 mt-10 mr-20 '
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={3000}
          stopOnHover={true}
        >
          <div>
            <img src="Acservice.jpg" alt="Slide 1" />

          </div>
          <div>
            <img src="Acservice.jpg" alt="Slide 2" />

          </div>
          <div>
            <img src="Acservice.jpg" alt="Slide 3" />

          </div>
        </Carousel>
      </div>
    </div>



    <div className=" ml-20 mr-20  mt-24">
      <div className="text-4xl font-bold mb-6  ">AC Repair</div>
      <section className=" flex">
        <div class="max-w-5xl border border-gray-300 mb-10 p-4  flex items-start justify-between">
          <div>
            <h1 class="text-xl font-bold ">Refrigerant Leak Detection and Repair</h1>
            <ul class="list-disc ml-6">
              <li>Involves inspecting the system.</li>
              <li>Testing components.</li>
              <li>Technicians locate leaks, repair damaged lines or components, and recharge the system with the correct amount of refrigerant.</li>
              <li>Using diagnostic tools to pinpoint issues such as refrigerant leaks and compressor malfunctions.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2 " />
              <button onClick={() => { addToCart('aaa', 1, 400, 'repairaa') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
         
          
      </section>
    </div>
    <div class="max-w-5xl border ml-20 mb-10 border-gray-300 p-4 flex items-start justify-between">
      <div>
        <h1 class="text-xl font-bold mb-3">Refrigerant Leak Detection and Repair</h1>
        <ul class="list-disc ml-6">
          <li>Involves inspecting the system.</li>
          <li>Testing components.</li>
          <li>Technicians locate leaks, repair damaged lines or components, and recharge the system with the correct amount of refrigerant.</li>
          <li>Using diagnostic tools to pinpoint issues such as refrigerant leaks and compressor malfunctions.</li>
        </ul>
      </div>
      <div class="flex items-center flex-grow justify-end">
        <div class="flex flex-col items-end">
          <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2 " />
          <button onClick={() => { addToCart('aaa', 1, 400, 'repairaa') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
          <p class="text-gray-500 mt-2">$XXX (optional)</p>
        </div>
      </div>
    </div>
    <div className="max-w-5xl ml-20 border mb-10 border-gray-300 p-4 flex items-start justify-between">
      <div>
        <h1 className="text-xl font-bold mb-3">Cleaning and Maintenance</h1>
        <ul className="list-disc ml-6">
          <li>Coil Cleaning: Both the evaporator coil (located indoors) and the condenser coil (located outdoors) are cleaned to remove dirt, dust, and debris that accumulate over time.</li>
          <li>Filter Replacement or Cleaning: Air filters in the AC system trap dust, pollen, and other particles to maintain indoor air quality and protect the system.</li>
          <li>Condensate Drain Cleaning: The condensate drain line removes excess moisture produced during the cooling process.</li>
        </ul>
      </div>
      <div class="flex items-center flex-grow justify-end">
        <div class="flex flex-col items-end">
          <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2  ml-4" />
          <button onClick={() => { addToCart('sss', 1, 200, 'Ac Service') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
          <p class="text-gray-500 mt-2">$XXX (optional)</p>
        </div>
      </div>
    </div>


    <div className="max-w-5xl  ml-20 mt-24">
      <div className="text-4xl font-bold mb-6">AC Service</div>
      <section className="space-y-8">

        <div class="border border-gray-300 p-4 flex items-start justify-between">
          <div>
            <h1 class="text-xl font-bold mb-3">Fault Detection and Analysis
            </h1>
            <ul class="list-disc ml-6">
              <li>Pressure Testing: Pressure testing involves pressurizing the AC system with nitrogen or another inert gas to detect leaks.</li>
              <li>Leak Detection Tools: Technicians may use specialized leak detection tools such as electronic leak detectors.</li>
              <li>Recharging Refrigerant: Once the system is leak-free and evacuated, technicians recharge the system with the correct amount of refrigerant.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2  ml-4" />
              <button onClick={() => { addToCart('slug', 1, 500, 'Fault') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
        <div class="border border-gray-300 p-4 flex items-start justify-between">
          <div>
            <h1 class="text-xl font-bold mb-3">Refrigerant Leak Detection and Repair</h1>
            <ul class="list-disc ml-6">
              <li>Involves inspecting the system.</li>
              <li>Testing components.</li>
              <li>Technicians locate leaks, repair damaged lines or components, and recharge the system with the correct amount of refrigerant.</li>
              <li>Using diagnostic tools to pinpoint issues such as refrigerant leaks and compressor malfunctions.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2 " />
              <button onClick={() => { addToCart('aaa', 1, 400, 'repairaa') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
        <div className="border border-gray-300 p-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold mb-3">Cleaning and Maintenance</h1>
            <ul className="list-disc ml-6">
              <li>Coil Cleaning: Both the evaporator coil (located indoors) and the condenser coil (located outdoors) are cleaned to remove dirt, dust, and debris that accumulate over time.</li>
              <li>Filter Replacement or Cleaning: Air filters in the AC system trap dust, pollen, and other particles to maintain indoor air quality and protect the system.</li>
              <li>Condensate Drain Cleaning: The condensate drain line removes excess moisture produced during the cooling process.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2  ml-4" />
              <button onClick={() => { addToCart('sss', 1, 200, 'Ac Service') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div className="max-w-5xl  ml-20 mt-24">
      <div className="text-4xl font-bold mb-6">Install & Uninstall</div>
      <section className="space-y-8">

        <div class="border border-gray-300 p-4 flex items-start justify-between">
          <div>
            <h1 class="text-xl font-bold mb-3">Fault Detection and Analysis
            </h1>
            <ul class="list-disc ml-6">
              <li>Pressure Testing: Pressure testing involves pressurizing the AC system with nitrogen or another inert gas to detect leaks.</li>
              <li>Leak Detection Tools: Technicians may use specialized leak detection tools such as electronic leak detectors.</li>
              <li>Recharging Refrigerant: Once the system is leak-free and evacuated, technicians recharge the system with the correct amount of refrigerant.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2  ml-4" />
              <button onClick={() => { addToCart('slug', 1, 500, 'Fault') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
        <div class="border border-gray-300 p-4 flex items-start justify-between">
          <div>
            <h1 class="text-xl font-bold mb-3">Refrigerant Leak Detection and Repair</h1>
            <ul class="list-disc ml-6">
              <li>Involves inspecting the system.</li>
              <li>Testing components.</li>
              <li>Technicians locate leaks, repair damaged lines or components, and recharge the system with the correct amount of refrigerant.</li>
              <li>Using diagnostic tools to pinpoint issues such as refrigerant leaks and compressor malfunctions.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2 " />
              <button onClick={() => { addToCart('aaa', 1, 400, 'repairaa') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
        <div className="border border-gray-300 p-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold mb-3">Cleaning and Maintenance</h1>
            <ul className="list-disc ml-6">
              <li>Coil Cleaning: Both the evaporator coil (located indoors) and the condenser coil (located outdoors) are cleaned to remove dirt, dust, and debris that accumulate over time.</li>
              <li>Filter Replacement or Cleaning: Air filters in the AC system trap dust, pollen, and other particles to maintain indoor air quality and protect the system.</li>
              <li>Condensate Drain Cleaning: The condensate drain line removes excess moisture produced during the cooling process.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2  ml-4" />
              <button onClick={() => { addToCart('sss', 1, 200, 'Ac Service') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div className="max-w-5xl  ml-20 mt-24">
      <div className="text-4xl font-bold mb-6">AC Gas Refill</div>
      <section className="space-y-8">

        <div class="border border-gray-300 p-4 flex items-start justify-between">
          <div>
            <h1 class="text-xl font-bold mb-3">Fault Detection and Analysis
            </h1>
            <ul class="list-disc ml-6">
              <li>Pressure Testing: Pressure testing involves pressurizing the AC system with nitrogen or another inert gas to detect leaks.</li>
              <li>Leak Detection Tools: Technicians may use specialized leak detection tools such as electronic leak detectors.</li>
              <li>Recharging Refrigerant: Once the system is leak-free and evacuated, technicians recharge the system with the correct amount of refrigerant.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2  ml-4" />
              <button onClick={() => { addToCart('slug', 1, 500, 'Fault') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
        <div class="border border-gray-300 p-4 flex items-start justify-between">
          <div>
            <h1 class="text-xl font-bold mb-3">Refrigerant Leak Detection and Repair</h1>
            <ul class="list-disc ml-6">
              <li>Involves inspecting the system.</li>
              <li>Testing components.</li>
              <li>Technicians locate leaks, repair damaged lines or components, and recharge the system with the correct amount of refrigerant.</li>
              <li>Using diagnostic tools to pinpoint issues such as refrigerant leaks and compressor malfunctions.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2 " />
              <button onClick={() => { addToCart('aaa', 1, 400, 'repairaa') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
        <div className="border border-gray-300 p-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold mb-3">Cleaning and Maintenance</h1>
            <ul className="list-disc ml-6">
              <li>Coil Cleaning: Both the evaporator coil (located indoors) and the condenser coil (located outdoors) are cleaned to remove dirt, dust, and debris that accumulate over time.</li>
              <li>Filter Replacement or Cleaning: Air filters in the AC system trap dust, pollen, and other particles to maintain indoor air quality and protect the system.</li>
              <li>Condensate Drain Cleaning: The condensate drain line removes excess moisture produced during the cooling process.</li>
            </ul>
          </div>
          <div class="flex items-center flex-grow justify-end">
            <div class="flex flex-col items-end">
              <img src="Acservice.jpg" alt="Image" class="w-25 h-25 object-cover rounded mb-2  ml-4" />
              <button onClick={() => { addToCart('sss', 1, 200, 'Ac Service') }} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Add to Cart</button>
              <p class="text-gray-500 mt-2">$XXX (optional)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </>;
};
export default service1;