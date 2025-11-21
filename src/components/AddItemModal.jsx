import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useModalContext } from "../contexts/AddItemModalContext";

function AddItemModal({ setShowAddItemModal }) {
  const overlay = useRef();
  const { currentUser } = useAuth();
  const { addItem } = useModalContext();

  // form state
  const [file, setFile] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // UI state
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  function handleCloseModal() {
    if (typeof setShowAddItemModal === "function") setShowAddItemModal(false);
  }

  function handleOverlayClick(e) {
    if (overlay.current && overlay.current.contains(e.target)) {
      handleCloseModal();
    }
  }

  // Upload to Cloudinary
  async function uploadFileToCloudinary(fileToUpload) {
    const CLOUD_NAME = "dhd6wvd09";
    const UPLOAD_PRESET = "lostnfound";

    const fd = new FormData();
    fd.append("file", fileToUpload);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      ` https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload
`,
      {
        method: "POST",
        body: fd,
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Cloudinary upload failed ${res.status} ${errText}`);
    }

    const json = await res.json();
    // secure_url is safe to use as imgUrl
    return json.secure_url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!file || !location.trim() || !description.trim()) {
      setError("Please complete all fields");
      return;
    }

    setUploading(true);
    try {
      const imgUrl = await uploadFileToCloudinary(file);

      const newItem = {
        id: Date.now(),
        username: currentUser || "anonymous",
        location: location.trim(),
        imgUrl,
        description: description.trim(),
        date: formattedDate,
      };

      addItem(newItem);

      handleCloseModal();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      ref={overlay}
      onClick={handleOverlayClick}
      className="bg-stone-950/10 backdrop-blur fixed w-full h-screen top-0 left-0 flex justify-center items-start pt-20">
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-3 w-md bg-white rounded-3xl p-6 shadow-natural text-(--text-main)">
        <h1 className="tracking-tighter text-xl font-bold">Add a lost item</h1>

        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-40  border border-stone-100  rounded-2xl cursor-pointer bg-white hover:bg-stone-50/85 transition duration-300 ease-in-out">
          <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 mb-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>

            <p className="mb-2">
              <span className="font-semibold tracking-tight">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs">SVG, PNG, JPG or GIF</p>
          </div>

          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              setFile(f || null);
              setFileName(f ? f.name : "");
            }}
            accept="image/*"
          />
        </label>

        {/* show selected filename (keeps your styling intact) */}
        <div className="text-sm text-stone-500">
          {fileName || "No file selected"}
        </div>

        {/* disabled username + date fields removed from modal UI per your request */}
        {/* username and date will be injected into the new item in state only */}

        <label htmlFor="location">
          <input
            className="ring ring-stone-200/40 disabled:cursor-not-allowed px-6 py-3.5 tracking-tight rounded-md w-full focus:outline-none  focus:ring focus:ring-(--text-main) transition-all transition-900"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>

        <label htmlFor="description">
          <input
            className="ring ring-stone-200/40 disabled:cursor-not-allowed px-6 py-3.5 tracking-tight rounded-md w-full focus:outline-none  focus:ring focus:ring-(--text-main) transition-all transition-900"
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {/* date remains hidden from modal UI and added by code */}
        <div className="flex gap-5 justify-end items-center mt-2">
          <p
            onClick={handleCloseModal}
            className="cursor-pointer tracking-tight">
            Cancel
          </p>
          <button
            type="submit"
            disabled={
              uploading || !file || !location.trim() || !description.trim()
            }
            className="py-2 px-4 rounded-md text-white bg-(--text-main) hover:bg-(--text-main)/90 transition disabled:bg-(--text-main)/20 disabled:cursor-not-allowed">
            {uploading ? "Uploading..." : "Validate"}
          </button>
        </div>

        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
}

export default AddItemModal;
