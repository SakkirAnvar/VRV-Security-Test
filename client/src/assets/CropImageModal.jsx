import ReactCrop from "react-easy-crop";

const CropImageModal = ({
  selectedImage,
  crop,
  setCrop,
  zoom,
  setZoom,
  aspect,
  croppedAreaPixels,
  onCropComplete,
  handleCropImage,
  onCloseCropModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 h-3/4 flex flex-col items-center justify-center relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onCloseCropModal}
          className="absolute top-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-lg z-50"
        >
          ✕
        </button>

        <div className="relative w-full h-full">
          {/* Crop Image */}
          <ReactCrop
            image={selectedImage}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            className="object-cover w-full h-full"
          />
          {/* Crop Image Button */}
          <button
            type="button"
            onClick={handleCropImage}
            className="absolute bottom-4 left-4 bg-blue text-white px-4 py-2 rounded-lg"
          >
            Crop Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropImageModal;
