import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const Forgot = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "password") {
      setPassword(e.target.value);
    }
    if (e.target.name === "cpassword") {
      setCPassword(e.target.value);
    }
    if (e.target.name === "email") {
      setEmail(e.target.value);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  const sendResetEmail = async () => {
    let data = {
      email,
      sendMail: true,
    };
    let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await a.json();
    if (res.success) {
      console.log("Password reset instructions have been sent to your email");
    } else {
      console.log("Error sending reset email");
    }
  };

  const resetPassword = async () => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      throw new Error("No token found");
    }
    if (password === cpassword) {
      let data = {
        token,
        password,
        sendMail: false,
      };
      let a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let res = await a.json();
      if (res.success) {
        console.log("Password has been changed");
      } else {
        console.log("Error resetting password");
      }
    } else {
      console.log("Passwords do not match");
    }
  };

  return (
    <>
      <Head>
        <title>Forgot - fixkaput.com</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <div>
        <section className="bg-gray-300 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Forgot Password
                </h1>
                {router.query.token && (
                  <div>
                    <div className="space-y-4 md:space-y-6" action="#">
                      <div>
                        <div>
                          <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            New Password
                          </label>
                          <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="password"
                            value={password}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="New Password"
                            required=""
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cpassword"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Confirm New Password
                          </label>
                          <input
                            onChange={handleChange}
                            type="password"
                            name="cpassword"
                            id="cpassword"
                            autoComplete="cpassword"
                            value={cpassword}
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Confirm New Password"
                            required=""
                          />
                        </div>
                        <div className="mt-5">
                          <button
                            onClick={resetPassword}
                            type="button"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                      {password != cpassword && (
                        <span className="text-red-600">
                          Passwords don’t match
                        </span>
                      )}
                      {password && password == cpassword && (
                        <span className="text-green-600">Passwords match</span>
                      )}
                    </div>
                  </div>
                )}
                {!router.query.token && (
                  <div className="space-y-4 md:space-y-6" action="#">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Your email
                      </label>
                      <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@company.com"
                        required=""
                      />
                      <div className="mt-5">
                        <button
                          onClick={sendResetEmail}
                          type="button"
                          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Forgot;
