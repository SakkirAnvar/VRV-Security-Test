import { useParams } from "react-router-dom";
import { useGetBlogByIdQuery } from "../api/blogApiSlice";
import { useGetTestimonialByIdQuery } from "../api/testimonialsApiSlice";
import { useGetPackageByIdQuery } from "../api/packageApiSlice";
import DOMPurify from "dompurify";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import ErrorMessage from "../Component/ErrorComponent";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

const View = ({ type }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [mainImage, setMainImage] = useState("");
  const [selectedThumbnail, setSelectedThumbnail] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const { id } = useParams();
  let queryHook;
  switch (type) {
    case "blog":
      queryHook = useGetBlogByIdQuery;
      break;
    case "testimonial":
      queryHook = useGetTestimonialByIdQuery;
      break;
    case "package":
      queryHook = useGetPackageByIdQuery;
      break;
    default:
      return <div>Invalid type specified.</div>;
  }

  const { data, isFetching, isError, error } = queryHook(id);

  useEffect(() => {
    if (data?.backgroundUrl) {
      let fullUrls;
      if (Array.isArray(data?.backgroundUrl)) {
        fullUrls = data?.backgroundUrl?.map((url) => `${baseUrl}${url}`);
      } else {
        fullUrls = [`${baseUrl}${data?.backgroundUrl}`];
      }
      setImageUrls(fullUrls);
      if (fullUrls?.length > 0) {
        setMainImage(fullUrls[0]);
        setSelectedThumbnail(fullUrls[0]);
      }
    }
  }, [data, baseUrl]);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
    setSelectedThumbnail(image);
  };

  const toggleDropdown = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getLatestDate = (createdAt, updatedAt) => {
    const createdDate = new Date(createdAt);
    const updatedDate = new Date(updatedAt);
    return createdDate > updatedDate ? createdDate : updatedDate;
  };

  if (isFetching) return <Loader />;
  if (!data) return <div>No data available.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-8 lg:p-12 mt-10">
      {isError ? (
        <ErrorMessage
          message={error?.data?.message || "Error loading details"}
        />
      ) : (
        <>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-8 text-center uppercase">
            {type} Details
          </h1>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex flex-col justify-center">
              <img
                src={mainImage}
                alt="Main Safari"
                className="w-full h-auto object-cover rounded-lg p-2"
              />
              {imageUrls?.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {imageUrls?.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Safari Image ${index + 1}`}
                      className={`w-full h-auto sm:h-[100px] md:h-[120px] lg:h-[240px] object-cover rounded-lg cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 ${
                        selectedThumbnail === imageUrl
                          ? "border-4 border-green-500"
                          : ""
                      }`}
                      onClick={() => handleThumbnailClick(imageUrl)}
                    />
                  ))}
                </div>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 text-center">
              {data?.title}
            </h2>

            {data?.name && (
              <>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  Package Name
                </h3>
                <p className="text-xl text-gray-700 mb-8">{data?.name}</p>
              </>
            )}

            <hr className="my-8 border-gray-300" />

            {data?.shortDescription && (
              <>
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  Short Description
                </h3>
                <p className="text-xl text-gray-700 mb-8">
                  {data?.shortDescription}
                </p>
              </>
            )}

            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              {type === "package" ? "Description" : "Content"}
            </h3>
            <div className="text-gray-800 leading-relaxed text-lg">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    `${type === "package" ? data?.description : data?.content}`
                  ),
                }}
              />
            </div>

            {/* Render additional fields for packages */}
            {type === "package" && (
              <>
                {data?.subtitles && data.subtitles.length > 0 && (
                  <>
                    {data.subtitles.map((subtitle, index) => (
                      <div key={index} className="mb-6">
                        <h3
                          className="flex gap-2 items-center text-2xl font-semibold text-gray-700 mb-4 mt-4 cursor-pointer text-justify"
                          onClick={() => toggleDropdown(index)}
                        >
                          <span>{subtitle?.subtitle}
                          {expandedIndex === index ? (
                            <FaAngleUp />
                          ) : (
                            <FaAngleDown />
                          )}
                          </span>
                        </h3>
                        {expandedIndex === index && (
                          <p
                            className="text-xl text-gray-700 mb-8"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(subtitle?.description),
                            }}
                          ></p>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {/* Days */}
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  Days
                </h3>
                <p className="text-xl text-gray-700 mb-8">{data?.days}</p>

                {/* Price */}
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  Price
                </h3>
                <p className="text-xl text-gray-700 mb-8">{data?.price}</p>

                {/* Category */}
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  Category
                </h3>
                <p className="text-xl text-gray-700 mb-8">
                  {data?.categoryId?.name || "No Category"}
                </p>
              </>
            )}

            {/* Created By */}
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Created By
            </h3>
            <p className="text-xl text-gray-700 mb-8">
              {data?.createdBy?.userName || "Unknown"} -{" "}
              {getLatestDate(
                data?.createdAt,
                data?.updatedAt
              ).toLocaleDateString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default View;
