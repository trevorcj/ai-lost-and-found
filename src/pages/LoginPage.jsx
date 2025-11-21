import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password] = useState("");

  function handleSignIn(e) {
    e.preventDefault();
    if (!username.trim()) {
      alert("Enter your username");
      return;
    }
    setCurrentUser(username.trim());
    navigate("/");
  }

  return (
    <div className="container mx-auto w-md pt-20">
      <h1 className="text-4xl tracking-tight font-medium">
        Login to your account
      </h1>
      <p className="tracking-tight mt-5 text-stone-500">
        Don't have an account?{" "}
        <Link to="/signup" className="text-(--text-main) underline">
          Sign up
        </Link>
      </p>
      <form
        onSubmit={handleSignIn}
        className="text-(--text-main) text-[15px] mt-8 flex flex-col gap-4">
        <input
          className="bg-stone-200/40 px-6 py-3.5 tracking-tighter rounded-md w-md focus:outline-none  focus:ring focus:ring-(--text-main) transition-all transition-900"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="bg-stone-200/40 px-6 py-3.5 tracking-tighter rounded-md w-md focus:outline-none  focus:ring focus:ring-(--text-main) transition-all transition-900"
          type="password"
          placeholder="Enter your password"
        />
        <button
          type="submit"
          className="py-3.5 bg-(--text-main) text-white tracking-tight rounded-md cursor-pointer hover:bg-(--text-main)/90 transition-all transition-900 focus:ring focus:ring-stone-800">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
