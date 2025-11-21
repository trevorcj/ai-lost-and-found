import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email] = useState("");
  const [password] = useState("");

  function handleCreate(e) {
    e.preventDefault();
    if (!username.trim()) {
      alert("Enter a username");
      return;
    }
    setCurrentUser(username.trim());
    navigate("/");
  }

  return (
    <div className="container mx-auto w-md pt-20">
      <h1 className="text-4xl tracking-tight font-medium">Create an account</h1>
      <p className="tracking-tight mt-5 text-stone-500">
        Already have an account?{" "}
        <Link to="/login" className="text-(--text-main) underline">
          Log in
        </Link>
      </p>
      <form
        onSubmit={handleCreate}
        className="text-(--text-main) text-[15px] mt-8 flex flex-col gap-4">
        <input
          className="bg-stone-200/40 px-6 py-3.5 tracking-tighter rounded-md w-md focus:outline-none  focus:ring focus:ring-(--text-main) transition-all transition-900"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="bg-stone-200/40 px-6 py-3.5 tracking-tighter rounded-md w-md focus:outline-none  focus:ring focus:ring-(--text-main) transition-all transition-900 "
          type="email"
          placeholder="Email address"
        />
        <input
          className="bg-stone-200/40 px-6 py-3.5 tracking-tighter rounded-md w-md focus:outline-none  focus:ring focus:ring-(--text-main) transition-all transition-900"
          type="password"
          placeholder="Password"
        />
        <button
          type="submit"
          className="py-3.5 bg-(--text-main) text-white tracking-tight rounded-md cursor-pointer hover:bg-(--text-main)/90 transition-all transition-900 focus:ring focus:ring-stone-800">
          Create account
        </button>
      </form>
    </div>
  );
}

export default Signup;
