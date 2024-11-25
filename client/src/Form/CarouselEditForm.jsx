import { useState, useEffect, useRef } from "react";
import CropImageModal from "../assets/CropImageModal";
import { compressImage, getCroppedImage } from "../utils/imageUtils";
import Loader from "../assets/Loader";

const CarouselEditForm = ({ onClose, onSubmit, existingData, editing }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [formData, setFormData] = useState({
    header: "",
    paragraph: "",
    backgroundUrl: null,
    mediaFormat: "image",
    alt: "",
  });

  const [errors, setErrors] = useState({
    header: "",
    paragraph: "",
    backgroundUrl: "",
    mediaFormat: "",
    alt: "",
  });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const modalRef = useRef();

  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
  ];
  const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/webm"];
  const allowedGifTypes = ["image/gif"];

  const validateFileType = (file) => {
    const { type } = file;
    if (
      formData?.mediaFormat === "image" &&
      !allowedImageTypes.includes(type)
    ) {
      return "Invalid image file type.";
    }
    if (
      formData?.mediaFormat === "video" &&
      !allowedVideoTypes.includes(type)
    ) {
      return "Invalid video file type.";
    }
    if (formData?.mediaFormat === "gif" && !allowedGifTypes.includes(type)) {
      return "Invalid GIF file type.";
    }
    return null; // No errors
  };

  // Handle image input
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const fileTypeError = validateFileType(file);
    if (fileTypeError) {
      setErrors((prev) => ({
        ...prev,
        backgroundUrl: fileTypeError,
      }));
      return;
    }
    const videoTypes = ["video/mp4", "video/mpeg", "video/webm"];
    if (videoTypes.includes(file.type)) {
      setFormData((prev) => ({
        ...prev,
        backgroundUrl: file,
      }));
    } else {
      setIsCropModalOpen(true);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    try {
      const croppedBlob = await getCroppedImage(
        selectedImage,
        croppedAreaPixels,
        1920,
        972
      );
      const compressedImage = await compressImage(croppedBlob);
      setCroppedImage(URL.createObjectURL(compressedImage));

      setFormData({
        ...formData,
        backgroundUrl: croppedBlob,
      });
      setIsCropModalOpen(false);
    } catch (error) {
      alert("Error during image crop/compress:", error);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      backgroundUrl: null,
    }));
    setCroppedImage(null);
  };

  useEffect(() => {
    if (existingData) {
      setFormData({
        header: existingData?.header,
        paragraph: existingData?.paragraph,
        mediaFormat: existingData?.mediaFormat,
        alt: existingData?.alt,
        backgroundUrl: existingData?.backgroundUrl,
      });
    }
  }, [existingData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.header?.trim()) {
      newErrors.header = "Header is required.";
    }
    if (!formData?.paragraph?.trim()) {
      newErrors.paragraph = "Description is required.";
    }
    if (!formData?.alt?.trim()) {
      newErrors.alt = "Alt text is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrors({});

    try {
      const formDataWithImage = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataWithImage?.append(key, formData[key]);
      });

      const result = await onSubmit(existingData?._id, formDataWithImage);

      if (result?.success) {
        onClose();
      } else {
        setErrors({
          backgroundUrl: result?.error || "File too large.",
        });
      }
    } catch (err) {
      setErrors({
        backgroundUrl:
          err?.message || "An unexpected error occurred. Please try again.",
      });
      alert("Failed to edit carousel:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        if (!isCropModalOpen) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isCropModalOpen]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center pt-10">
      <div
        className="bg-white pt-3 rounded-lg shadow-lg max-w-3xl w-full flex flex-col h-2/3"
        ref={modalRef}
      >
        {editing ? (
          <Loader />
        ) : (
          <>
            {/* Title Section */}
            <div className="bg-white p-3 rounded-t-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Banner Item
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Divider Line */}
            <hr className="border-t border-gray-300" />

            {/* Form Section */}
            <div className="bg-gray-100 p-4 rounded-b-lg flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-200">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form Fields */}
                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Header <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="header"
                      value={formData?.header}
                      onChange={handleFormChange}
                      className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Header"
                      required
                      autoComplete="off"
                    />
                    {errors?.header && (
                      <div className="text-red text-sm mt-1">
                        {errors?.header}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Media Format <span className="text-red">*</span>
                    </label>
                    <select
                      name="mediaFormat"
                      value={formData?.mediaFormat}
                      onChange={handleFormChange}
                      className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="gif">GIF</option>
                    </select>
                    {errors?.mediaFormat && (
                      <div className="text-red text-sm mt-1">
                        {errors?.mediaFormat}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Description <span className="text-red">*</span>
                    </label>
                    <textarea
                      name="paragraph"
                      value={formData?.paragraph}
                      onChange={handleFormChange}
                      className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Paragraph"
                      required
                      autoComplete="off"
                    />
                    {errors?.paragraph && (
                      <div className="text-red text-sm mt-1">
                        {errors?.paragraph}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Alt Text <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="alt"
                      value={formData?.alt}
                      onChange={handleFormChange}
                      className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Alt Text"
                      required
                      autoComplete="off"
                    />
                    {errors?.alt && (
                      <div className="text-red text-sm mt-1">{errors?.alt}</div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Image/Video
                    </label>
                    <input
                      type="file"
                      name="backgroundUrl"
                      onChange={handleImageChange}
                      autoComplete="off"
                      className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors?.backgroundUrl && (
                      <div className="text-red text-sm mt-1">
                        {errors?.backgroundUrl}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </label>
                    {formData?.backgroundUrl && (
                      <div className="relative">
                        <img
                          src={
                            croppedImage
                              ? croppedImage
                              : `${baseUrl}${formData?.backgroundUrl}`
                          }
                          alt="Preview"
                          className="w-34 h-16 object-cover border border-gray-300 rounded-lg ml-4"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-0 right-0 bg-red text-white px-2 py-1 rounded-bl-lg hover:opacity-90"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4 border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-red text-white hover:opacity-90 px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green text-white hover:opacity-90 px-6 py-2 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
      {isCropModalOpen && (
        <CropImageModal
          selectedImage={selectedImage}
          crop={crop}
          setCrop={setCrop}
          aspect={16 / 9}
          zoom={zoom}
          setZoom={setZoom}
          croppedAreaPixels={croppedAreaPixels}
          onCropComplete={onCropComplete}
          handleCropImage={handleCropImage}
          onCloseCropModal={() => setIsCropModalOpen(false)} // Close the modal
        />
      )}
    </div>
  );
};

export default CarouselEditForm;
