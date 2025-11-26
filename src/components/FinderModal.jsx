import { useRef, useState, useEffect } from "react";
import { useFinderModal } from "../contexts/FinderModalContext";

function FinderModal() {
  const { selectedItem, closeFinder } = useFinderModal();
  const overlay = useRef();

  // --- STATE ---
  const [foundFile, setFoundFile] = useState(null);
  const [foundPreview, setFoundPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Form State
  const [showFinderForm, setShowFinderForm] = useState(false);
  const [finderName, setFinderName] = useState("");
  const [finderMobile, setFinderMobile] = useState("");
  const [finderLocation, setFinderLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reset state whenever a NEW item is selected
  useEffect(() => {
    if (selectedItem) resetAllState();
  }, [selectedItem]);

  function resetAllState() {
    setFoundFile(null);
    setFoundPreview(null);
    setResult(null);
    setAnalyzing(false);
    setShowFinderForm(false);
    setFinderName("");
    setFinderMobile("");
    setFinderLocation("");
    setSubmitted(false);
  }

  function handleClose() {
    resetAllState();
    closeFinder();
  }

  if (!selectedItem) return null;

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFoundFile(file);
      setFoundPreview(URL.createObjectURL(file));
      setResult(null);
      setShowFinderForm(false);
    }
  }

  async function handleValidate() {
    if (!foundFile) return;

    const targetUrl = selectedItem.imageurl;

    if (!targetUrl) {
      alert("Error: This item has no image URL.");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      console.log("calling gemini");
    } catch (error) {
      alert("Validation failed.");
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  }

  function handleSubmitFinder(e) {
    e.preventDefault();
    if (!finderMobile.trim() || !finderLocation.trim()) {
      alert("Please fill in the required fields.");
      return;
    }
    alert("item found");
  }

  return (
    <div
      ref={overlay}
      onClick={(e) => {
        if (overlay.current === e.target) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[600px]">
        <div className="flex flex-col w-full p-6 border-b md:w-1/2 bg-stone-50 md:border-b-0 md:border-r border-stone-100">
          <h3 className="mb-4 text-sm font-bold tracking-wider uppercase text-stone-400">
            Looking For
          </h3>
          <div className="relative flex-1 mb-4 overflow-hidden bg-white border shadow-sm rounded-2xl border-stone-100 group">
            <img
              src={selectedItem.imageurl}
              className="object-cover w-full h-full"
              alt="Lost item"
            />
            <div className="absolute bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-lg font-bold">{selectedItem.description}</p>
              <p className="text-sm opacity-80">{selectedItem.location}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full p-6 overflow-y-auto bg-white md:w-1/2">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <img
                src="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"
                alt="Success"
                className="w-32 h-32 rounded-full"
              />
              <h2 className="text-2xl font-bold text-green-600">
                Info Submitted!
              </h2>
              <p className="max-w-xs text-stone-500">
                The owner has been notified.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2 mt-4 text-white transition rounded-xl bg-stone-900 hover:bg-stone-800">
                Close & Back to Feed
              </button>
            </div>
          ) : showFinderForm ? (
            <div className="flex flex-col h-full">
              <h3 className="mb-6 text-sm font-bold tracking-wider uppercase text-stone-400">
                Contact Owner
              </h3>
              <form
                onSubmit={handleSubmitFinder}
                className="flex flex-col flex-1 gap-4">
                {/* Inputs */}
                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-400">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    value={finderName}
                    onChange={(e) => setFinderName(e.target.value)}
                    className="w-full px-4 py-3 transition border-none rounded-xl bg-stone-50 focus:ring-2 focus:ring-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-400">
                    MOBILE NUMBER *
                  </label>
                  <input
                    type="tel"
                    value={finderMobile}
                    onChange={(e) => setFinderMobile(e.target.value)}
                    required
                    className="w-full px-4 py-3 transition border-none rounded-xl bg-stone-50 focus:ring-2 focus:ring-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold text-stone-400">
                    PICKUP LOCATION *
                  </label>
                  <input
                    type="text"
                    value={finderLocation}
                    onChange={(e) => setFinderLocation(e.target.value)}
                    required
                    className="w-full px-4 py-3 transition border-none rounded-xl bg-stone-50 focus:ring-2 focus:ring-stone-200 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4 mt-auto">
                  <button
                    type="button"
                    onClick={() => setShowFinderForm(false)}
                    className="flex-1 py-3 font-medium transition text-stone-500 hover:bg-stone-100 rounded-xl">
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
                    Submit Info
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <h3 className="mb-4 text-sm font-bold tracking-wider uppercase text-stone-400">
                What you found
              </h3>

              <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
                {foundPreview ? (
                  <div className="relative w-full h-full overflow-hidden rounded-2xl group">
                    <img
                      src={foundPreview}
                      className={`w-full h-full object-cover transition-all duration-500 
                                    ${
                                      result && result.similarity >= 60
                                        ? "ring-4 ring-green-500"
                                        : ""
                                    }
                                    ${
                                      result && result.similarity < 60
                                        ? "ring-4 ring-red-500 grayscale"
                                        : ""
                                    }
                                `}
                      alt="Found preview"
                    />

                    {/* Result Overlay */}
                    {result && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white bg-black/40 backdrop-blur-xs">
                        <div
                          className={`text-5xl font-black mb-2 ${
                            result.similarity >= 60
                              ? "text-green-400"
                              : "text-red-400"
                          }`}>
                          {result.similarity}%
                        </div>
                        <p className="text-lg font-medium">
                          {result.similarity >= 60
                            ? "It's a Match!"
                            : "Not a Match"}
                        </p>
                        <p className="text-sm opacity-80 mt-2 max-w-[80%]">
                          {result.reason}
                        </p>
                      </div>
                    )}

                    {!analyzing && (
                      <button
                        onClick={() => {
                          setFoundFile(null);
                          setFoundPreview(null);
                          setResult(null);
                        }}
                        className="absolute p-2 text-white transition rounded-full top-3 right-3 bg-white/20 hover:bg-white/40 backdrop-blur">
                        ✕
                      </button>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full gap-3 transition border-2 border-dashed cursor-pointer border-stone-200 rounded-2xl hover:bg-stone-50 text-stone-400">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className="font-medium">Tap to take photo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 font-medium transition text-stone-500 hover:bg-stone-100 rounded-xl">
                  Cancel
                </button>

                {!result ? (
                  <button
                    onClick={handleValidate}
                    disabled={!foundFile || analyzing}
                    className="flex-[2] py-3 bg-stone-900 text-white font-medium rounded-xl hover:bg-stone-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {analyzing ? "Analyzing..." : "Validate Match"}
                  </button>
                ) : (
                  // Success State Button
                  result.similarity >= 60 && (
                    <button
                      onClick={() => setShowFinderForm(true)}
                      className="py-3 font-medium text-white transition bg-green-600 shadow-lg flex-2 rounded-xl hover:bg-green-700 shadow-green-200">
                      Next Step →
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinderModal;
