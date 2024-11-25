import { useState, useEffect, useRef } from "react";
import { getCroppedImage } from "../utils/imageUtils";
import CropImageModal from "../assets/CropImageModal";
import Loader from "../assets/Loader";

const CarouselAddForm = ({
  onClose,
  onSubmit,
  formData,
  setFormData,
  closeModelWithoutSave,
  adding,
}) => {
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

  const validateForm = () => {
    const { header, paragraph, backgroundUrl, alt, mediaFormat } = formData;
    const newErrors = {};

    if (!header?.trim()) {
      newErrors.header = "Header is required.";
    }

    if (!paragraph?.trim()) {
      newErrors.paragraph = "Description is required.";
    }

    if (!backgroundUrl) {
      newErrors.backgroundUrl = "Image/Video is required.";
    }

    if (!alt?.trim()) {
      newErrors.alt = "Alt Text is required.";
    }

    if (!["image", "video", "gif"].includes(mediaFormat)) {
      newErrors.mediaFormat = "Invalid media format.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrors({});
    const formDataWithImage = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataWithImage?.append(key, formData[key]);
    });

    try {
      const result = await onSubmit(formDataWithImage);
      setFormData({
        header: "",
        paragraph: "",
        backgroundUrl: null,
        mediaFormat: "image",
        alt: "",
      });
      if (result?.success) {
        onClose();
      } else {
        setErrors({
          backgroundUrl: result?.error || "File too large",
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
          closeModelWithoutSave();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, closeModelWithoutSave, isCropModalOpen]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center pt-10 px-4 sm:px-6 lg:px-8">
      <div
        className="bg-white pt-3 rounded-lg shadow-lg w-full max-w-3xl flex flex-col h-2/3"
        ref={modalRef}
      >
        {adding ? (
          <Loader />
        ) : (
          <>
            {/* Title Section */}
            <div className="bg-white p-3 rounded-t-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Banner Item
                </h2>
                <button
                  onClick={closeModelWithoutSave}
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
                      required
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
                      Image/Video <span className="text-red">*</span>
                    </label>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      autoComplete="off"
                    />
                    {errors?.backgroundUrl && (
                      <div className="text-red text-sm mt-1">
                        {errors?.backgroundUrl}
                      </div>
                    )}
                  </div>

                  {formData?.backgroundUrl && (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(formData?.backgroundUrl)}
                        alt="Preview"
                        className="w-24 h-16 object-cover border border-gray-300 rounded-lg"
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

                <div className="flex justify-end space-x-2 mt-4 border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={closeModelWithoutSave}
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

export default CarouselAddForm;
