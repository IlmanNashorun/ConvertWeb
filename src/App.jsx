import React, { useState, useRef } from "react";

const App = () => {
  const [format, setFormat] = useState("webp");
  const [fileName, setFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      fileInputRef.current.files = event.dataTransfer.files;
      setFileName(file.name);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const file = fileInputRef.current.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const ext = format === "jpeg" ? "jpg" : format;
        const convertedFileName = `converted_${fileName.replace(
          /\.\w+$/,
          `.${ext}`
        )}`;

        canvas.toBlob(
          (blob) => {
            const a = document.createElement("a");
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = convertedFileName;
            a.click();
            URL.revokeObjectURL(url);
          },
          `image/${format}`,
          0.9
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className=" min-h-screen flex flex-col justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-slate-700 mb-8">
          Welcome to the Image Converter
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 p-8 rounded-lg shadow-lg space-y-4 w-full max-w-md"
        >
          <h2 className="text-xl font-bold text-center text-blue-600">
            Convert Your Image
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              CHOOSE OR DROP FILE
            </label>
            <div
              className={`mt-2 relative border-2 border-dashed rounded-lg p-6 ${
                isDragOver ? "border-blue-600 bg-blue-100" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                required
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                className="flex justify-center items-center cursor-pointer px-5 rounded-lg font-semibold h-12 bg-blue-500 text-white transition duration-300 hover:bg-blue-600"
                onClick={handleFileSelect}
              >
                {fileName ? fileName : "Choose or Drop File"}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SELECT FORMAT
            </label>
            <select
              value={format}
              onChange={handleFormatChange}
              className="mt-2 border rounded-md p-2 w-full bg-gray-50 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="webp">WEBP</option>
              <option value="jpeg">JPG</option>
              <option value="png">PNG</option>
              <option value="gif">GIF</option>
            </select>
          </div>

          <input
            type="submit"
            value="Convert"
            className="bg-blue-500 text-white rounded-md p-2 w-full cursor-pointer hover:bg-blue-600 transition duration-300"
          />
        </form>
      </div>
    </div>
  );
};

export default App;
