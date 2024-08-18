import axios from "axios";
import { Button, Card, Label, TextInput, Spinner } from "flowbite-react";
import React, { useState } from "react";
import { HiCheck, HiExclamation } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <main className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500">
      <div className="bg-black bg-opacity-50 w-full h-full absolute"></div>{" "}
      {/* Optional overlay */}
      <Card className="max-w-md w-full p-6 border-blue-500 rounded-md relative z-10 bg-white bg-opacity-90">
        <h1 className="text-3xl font-bold text-center mb-2">LinkUp</h1>
        <p className="text-lg text-center mb-6 text-gray-700">
          Connecting Moments, Creating Memories.
        </p>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="username" value="Username" className="mb-2" />
            <TextInput
              id="username"
              placeholder="Enter your username"
              name="username"
              value={input.username}
              onChange={handleChange}
              autoComplete="username" // Correct attribute usage
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email" value="Email" className="mb-2" />
            <TextInput
              id="email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={input.email}
              onChange={handleChange}
              autoComplete="email" // Correct attribute usage
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password" value="Password" className="mb-2" />
            <TextInput
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={input.password}
              onChange={handleChange}
              autoComplete="new-password" // Correct attribute usage
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-darkerBlue text-white"
            disabled={loading}
          >
            {loading ? (
              <Spinner aria-label="Loading" size="sm" light={true} />
            ) : (
              "Register"
            )}
          </Button>
          <span className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-900">
              Click here to login
            </Link>
          </span>
        </form>
      </Card>
    </main>
  );
};

export default SignUp;
