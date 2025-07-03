import { useState } from "react";
import { toast } from "react-toastify";
import Head from "next/head";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = form;

    if (!name || !email || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>fixKaput | Contact</title>
      </Head>
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-16 px-6">
        <div className="max-w-7xl mx-auto shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-white">
          {/* Contact Info */}
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white p-10 flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="mb-6 text-lg leading-relaxed opacity-90">
              Have a question or need help with a service? We'd love to hear from you!
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">Email</h4>
                <p className="opacity-80">support@fixkaput.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Phone</h4>
                <p className="opacity-80">+91 93811 45944</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Address</h4>
                <p className="opacity-80">Mehdipatnam, Hyderabad, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition duration-300 ease-in-out disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
