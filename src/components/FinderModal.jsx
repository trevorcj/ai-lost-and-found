import React, { useEffect, useRef, useState } from "react";
import { useFinderModal } from "../contexts/FinderModalContext";
import { useAuth } from "../contexts/AuthContext";
import { useModalContext } from "../contexts/AddItemModalContext";

export default function FinderModal() {
  const { showFinderModal, selectedItem, closeFinder } = useFinderModal();
  const { currentUser } = useAuth();
  const { removeItem } = useModalContext();
  const overlayRef = useRef();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [similarity, setSimilarity] = useState(null);
  const [loadingModel, setLoadingModel] = useState(false);
  const [runningCompare, setRunningCompare] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [model, setModel] = useState(null);

  const [nextEnabled, setNextEnabled] = useState(false);
  const [showFinderForm, setShowFinderForm] = useState(false);
  const [finderName, setFinderName] = useState("");
  const [finderMobile, setFinderMobile] = useState("");
  const [finderLocation, setFinderLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let mounted = true;
    if (!showFinderModal) return;
    if (modelLoaded) return;
    setLoadingModel(true);
    (async () => {
      try {
        const tf = await import("@tensorflow/tfjs");
        const mobilenet = await import("@tensorflow-models/mobilenet");
        const m = await mobilenet.load({ version: 2, alpha: 1.0 });
        if (!mounted) return;
        setModel({ tf, mobilenetModel: m });
        setModelLoaded(true);
      } catch (e) {
        console.error("Failed to load TF model", e);
        setToast({ type: "error", text: "Failed to load model" });
      } finally {
        if (mounted) setLoadingModel(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [showFinderModal, modelLoaded]);

  const loadImageElementFromUrl = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });

  const loadImageElementFromFile = (fileBlob) =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(fileBlob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      img.src = url;
    });

  // safe similarity
  const cosineSimilarity = (tf, a, b) => {
    const dot = a.dot(b).arraySync();
    const na = a.norm().arraySync();
    const nb = b.norm().arraySync();
    const c = dot / (na * nb);
    return Math.max(-1, Math.min(1, c));
  };

  // compare function
  const handleCompare = async () => {
    setSimilarity(null);
    setNextEnabled(false);
    setShowFinderForm(false);
    if (!selectedItem || !file) {
      setToast({ type: "error", text: "Select an image and try again" });
      return;
    }
    if (!model || !model.tf || !model.mobilenetModel) {
      setToast({ type: "error", text: "Model not ready" });
      return;
    }

    setRunningCompare(true);
    try {
      const imgA = await loadImageElementFromUrl(selectedItem.imgUrl);
      const imgB = await loadImageElementFromFile(file);

      const tf = model.tf;
      const embA = tf.tidy(() => {
        const activation = model.mobilenetModel.infer(imgA, true);
        return activation.flatten();
      });
      const embB = tf.tidy(() => {
        const activation = model.mobilenetModel.infer(imgB, true);
        return activation.flatten();
      });

      const cos = cosineSimilarity(tf, embA, embB);
      const percent = Math.round(((cos + 1) / 2) * 10000) / 100;
      setSimilarity(percent);

      embA.dispose?.();
      embB.dispose?.();

      if (percent >= 60) {
        setNextEnabled(true);
        setToast({ type: "success", text: `Match ${percent}% — proceed` });
      } else {
        setToast({ type: "error", text: `Not a match (${percent}%).` });
        setTimeout(() => {
          closeFinder();
        }, 900);
      }
    } catch (err) {
      console.error("compare error", err);
      setToast({ type: "error", text: "Comparison failed" });
    } finally {
      setRunningCompare(false);
    }
  };

  function handleOverlayClick(e) {
    if (overlayRef.current && overlayRef.current.contains(e.target)) {
      closeFinder();
    }
  }

  const handleSubmitFinder = (e) => {
    e.preventDefault();
    if (!finderMobile.trim() || !finderLocation.trim()) {
      setToast({ type: "error", text: "Fill required fields" });
      return;
    }

    setSubmitted(true);
    setToast({ type: "success", text: "Finder info submitted" });

    // remove the matched item from the feed
    try {
      if (selectedItem && selectedItem.id) {
        removeItem(selectedItem.id);
      }
    } catch (err) {
      console.warn("removeItem failed", err);
    }
  };

  if (!showFinderModal || !selectedItem) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="bg-stone-950/10 backdrop-blur fixed w-full h-screen top-0 left-0 flex justify-center items-start pt-6 z-50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-3 w-md mx-auto bg-white rounded-3xl p-6 shadow-natural text-(--text-main) min-h-[70vh] max-h-[90vh] overflow-auto">
        <h1 className="tracking-tighter text-xl font-bold">Compare images</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <p className="text-sm text-stone-400 mb-2">Original item</p>
            <img
              src={selectedItem.imgUrl}
              alt={selectedItem.description}
              className="w-full rounded-2xl object-cover max-h-72"
            />
            <p className="text-xs mt-2 text-stone-500">
              {selectedItem.description}
            </p>
          </div>

          <div className="flex-1">
            <p className="text-sm text-stone-400 mb-2">Upload photo (finder)</p>

            <label
              htmlFor="finder-file"
              className="flex flex-col items-center justify-center w-full h-40 border border-stone-100 rounded-2xl cursor-pointer bg-white hover:bg-stone-50/85 transition duration-300 ease-in-out">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="font-semibold mb-2">Click to upload</p>
                <p className="text-xs">PNG, JPG or GIF</p>
              </div>
              <input
                id="finder-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  setFile(f || null);
                  setFileName(f ? f.name : "");
                  setSimilarity(null);
                  setNextEnabled(false);
                  setShowFinderForm(false);
                }}
              />
            </label>

            <div className="mt-2 text-sm text-stone-500">
              {fileName || "No file selected"}
            </div>

            <div className="flex gap-3 items-center mt-3">
              <button
                type="button"
                onClick={handleCompare}
                disabled={loadingModel || runningCompare || !file}
                className="py-2 px-4 rounded-md text-white bg-(--text-main) hover:bg-(--text-main)/90 disabled:bg-(--text-main)/20 disabled:cursor-not-allowed">
                {runningCompare
                  ? "Comparing..."
                  : loadingModel
                  ? "Loading model..."
                  : "Validate"}
              </button>

              <div className="text-sm text-stone-500">
                {similarity !== null && (
                  <div>
                    Match: <strong>{similarity}%</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowFinderForm(true)}
              disabled={!nextEnabled}
              className="py-2 px-4 rounded-md text-white bg-(--text-main) hover:bg-(--text-main)/90 disabled:bg-(--text-main)/20 disabled:cursor-not-allowed">
              Next step
            </button>
          </div>

          {showFinderForm && (
            <form
              onSubmit={handleSubmitFinder}
              className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={finderName}
                onChange={(e) => setFinderName(e.target.value)}
                className="px-6 py-3 rounded-md w-full focus:outline-none focus:ring focus:ring-(--text-main)"
              />

              <input
                type="tel"
                placeholder="Mobile number"
                value={finderMobile}
                onChange={(e) => setFinderMobile(e.target.value)}
                className="px-6 py-3 rounded-md w-full focus:outline-none focus:ring focus:ring-(--text-main)"
                required
              />

              <input
                type="text"
                placeholder="Public pickup location (e.g. 'Ikeja Mall car park')"
                value={finderLocation}
                onChange={(e) => setFinderLocation(e.target.value)}
                className="px-6 py-3 rounded-md w-full focus:outline-none focus:ring focus:ring-(--text-main)"
                required
              />

              <div className="text-sm text-yellow-800 bg-yellow-100 p-3 rounded-md">
                ⚠️ Caution: enter a public, safe location only. Avoid private
                addresses for your safety.
              </div>

              {!submitted ? (
                <div className="flex gap-3 justify-end items-center">
                  <p
                    onClick={() => setShowFinderForm(false)}
                    className="cursor-pointer">
                    Back
                  </p>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-md text-white bg-emerald-600 hover:bg-emerald-700">
                    Submit
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src="https://media.giphy.com/media/111ebonMs90YLu/giphy.gif"
                    alt="success"
                    className="w-24 h-24"
                  />
                  <button
                    onClick={() => {
                      closeFinder();
                      setSubmitted(false);
                      setFile(null);
                      setFileName("");
                      setSimilarity(null);
                    }}
                    className="py-2 px-4 rounded-md text-white bg-(--text-main)">
                    Back to feed
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {toast && (
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md ${
              toast.type === "error"
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white"
            }`}>
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}
