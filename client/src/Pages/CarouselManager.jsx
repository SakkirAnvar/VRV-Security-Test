import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  useGetFilteredCarouselQuery,
  useAddCarouselMutation,
  useEditCarouselMutation,
  useDeleteCarouselMutation,
} from "../api/carouselApiSlice";
import CarouselAddForm from "../Form/CarouselAddForm";
import CarouselEditForm from "../Form/CarouselEditForm";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../auth/authSlice";
import { useGetSettingsDataQuery } from "../api/settingsApiSlice.js";
import PrivateRoute from "../utils/PrivateRoute.jsx";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ErrorMessage from "../Component/ErrorComponent.jsx";

const CarouselManager = () => {
  const user = useSelector((state) => state.auth);
  const { userRole, permissions } = user;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addCarousel, { isLoading: adding }] = useAddCarouselMutation();
  const [editCarousel, { isLoading: editing }] = useEditCarouselMutation();
  const [deleteCarousel] = useDeleteCarouselMutation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCarousel, setCurrentCarousel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, isError, error, refetch } =
    useGetFilteredCarouselQuery({
      search: searchTerm,
      page: currentPage,
      limit: itemsPerPage,
    });

  const { data: settingsData } = useGetSettingsDataQuery({ id: user?._id });
  const tableHeadBg = settingsData?.settingsData?.tableHeadBg || "#206bc4";
  const tableHeadText = settingsData?.settingsData?.tableHeadText || "white";
  const checkboxValues = settingsData?.settingsData;

  useEffect(() => {
    if (settingsData?.settingsData?.pagenationLimit) {
      setItemsPerPage(settingsData?.settingsData?.pagenationLimit);
    }
  }, [settingsData]);

  const [formData, setFormData] = useState({
    header: "",
    paragraph: "",
    backgroundUrl: null,
    mediaFormat: "image",
    alt: "",
  });

  const closeModelWithoutSave = () => {
    setIsAddModalOpen(false);
  };

  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleAddNew = async (formData) => {
    try {
      await addCarousel(formData).unwrap();
      alert("Carousel item added successfully.");
      refetch();
      setIsAddModalOpen(false);
    } catch (err) {
      if (err?.status === 401) {
        dispatch(setLogout());
        navigate("/login");
        return;
      }
      alert(err?.data?.error || "Failed to add carousel.");
    }
  };

  const handleEditCarousel = async (id, formData) => {
    try {
      await editCarousel({ id, updatedCarousel: formData }).unwrap();
      alert("Carousel item updated successfully.");
      refetch();
      setIsEditModalOpen(false);
    } catch (err) {
      if (err?.status === 401) {
        dispatch(setLogout());
        navigate("/login");
        return;
      }
      alert(err?.data?.error || "Failed to edit carousel.");
    }
  };

  const handleDeleteCarousel = async (id) => {
    if (window.confirm("Are you sure you want to delete this carousel item?")) {
      try {
        await deleteCarousel(id).unwrap();
        alert("Carousel item deleted successfully.");
        const newTotalItems = (data?.totalItems || 0) - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        } else {
          refetch();
        }
      } catch (err) {
        if (err?.status === 401) {
          dispatch(setLogout());
          navigate("/login");
          return;
        }
        alert("Failed to delete carousel item.");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages || 1;
  const currentCarousels = data?.carousels || [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch();
    }
  };

  const isAdmin = userRole === "admin";
  const bannerPermissions = isAdmin
    ? {
        view: true,
        create: true,
        edit: true,
        delete: true,
      }
    : permissions?.banner || {};

  return (
    <PrivateRoute isComponentLoading={isLoading}>
      <div className="carousel-manager p-8 bg-gray-100 min-h-screen pt-20">
        <div className="md:container md:mx-auto md:px-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <h1 className="text-sm sm:text-2xl font-bold text-gray-800">
              Banner Manager
            </h1>
            {bannerPermissions?.create && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue text-white hover:bg-blue rounded-lg px-4 py-1 text-xs sm:text-base sm:px-6 sm:py-2"
              >
                + Add New
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Filter</h3>
            <hr className="mb-4" />
            <div>
              <label
                htmlFor="carousel-search"
                className="font-medium text-gray-700 mb-2 block"
              >
                Search:
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                <input
                  type="text"
                  id="carousel-search"
                  className="border border-gray-300 rounded-lg p-2 flex-grow sm:flex-grow-0 sm:w-48 mb-4 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-blue"
                  placeholder="Carousel Name"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
            <div className="w-full table">
              {isError ? (
                <ErrorMessage
                  message={error?.data?.message || "Error loading banners"}
                />
              ) : (
                <>
                  <table className="min-w-full border-collapse bg-white shadow-sm rounded-lg text-sm">
                    <thead>
                      <tr
                        style={{
                          backgroundColor: tableHeadBg,
                          color: tableHeadText,
                        }}
                      >
                        <th
                          className={`py-3 px-4 text-center uppercase tracking-wider w-0 ${
                            checkboxValues?.tableBorder
                              ? "border border-gray-300"
                              : ""
                          }`}
                        >
                          No
                        </th>
                        <th
                          className={`py-3 px-4 text-center uppercase tracking-wider w-24 ${
                            checkboxValues?.tableBorder
                              ? "border border-gray-300"
                              : ""
                          }`}
                        >
                          Header
                        </th>
                        <th
                          className={`py-3 px-4 text-center uppercase tracking-wider w-36 ${
                            checkboxValues?.tableBorder
                              ? "border border-gray-300"
                              : ""
                          }`}
                        >
                          Description
                        </th>
                        <th
                          className={`py-3 px-4 text-center uppercase tracking-wider w-24 ${
                            checkboxValues?.tableBorder
                              ? "border border-gray-300"
                              : ""
                          }`}
                        >
                          Media
                        </th>
                        <th
                          className={`py-3 px-4 text-center uppercase tracking-wider w-32 ${
                            checkboxValues?.tableBorder
                              ? "border border-gray-300"
                              : ""
                          }`}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentCarousels?.map((carousel, index) => (
                        <tr
                          key={carousel?._id}
                          className={`${
                            checkboxValues?.tableStripped
                              ? "even:bg-white odd:bg-gray-50"
                              : ""
                          }
                    ${checkboxValues?.tableHover ? "hover:bg-gray-100" : ""}
                    ${
                      checkboxValues?.tableBorder
                        ? "border-b border-gray-300"
                        : ""
                    }   
                    `}
                        >
                          <td
                            className={`py-4 px-4 text-sm font-medium text-gray-900 text-center ${
                              checkboxValues?.tableBorder
                                ? "border border-gray-300"
                                : ""
                            }`}
                          >
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td
                            className={`py-4 px-4 text-sm font-medium text-gray-900 text-center w-32 ${
                              checkboxValues?.tableBorder
                                ? "border border-gray-300"
                                : ""
                            }`}
                          >
                            <div className="line-clamp-5">
                              {carousel?.header}
                            </div>
                          </td>
                          <td
                            className={`py-4 px-4 text-sm text-gray-700 text-center w-32 ${
                              checkboxValues?.tableBorder
                                ? "border border-gray-300"
                                : ""
                            }`}
                          >
                            {carousel?.paragraph}
                          </td>
                          <td
                            className={`py-4 px-4 text-center w-24 ${
                              checkboxValues?.tableBorder
                                ? "border border-gray-300"
                                : ""
                            }`}
                          >
                            {carousel?.mediaFormat === "video" ? (
                              <video
                                src={`${baseUrl}${carousel?.backgroundUrl}`}
                                alt={carousel?.alt}
                                className="w-32 h-20 object-cover rounded-md"
                                controls
                              />
                            ) : (
                              <img
                                src={`${baseUrl}${carousel?.backgroundUrl}`}
                                alt={carousel?.alt}
                                className="w-32 h-20 object-cover rounded-md"
                              />
                            )}
                          </td>
                          <td
                            className={`py-4 px-4  text-center w-32${
                              checkboxValues?.tableBorder
                                ? "border border-gray-300"
                                : ""
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                              {bannerPermissions?.edit && (
                                <button
                                  onClick={() => {
                                    setCurrentCarousel(carousel);
                                    setIsEditModalOpen(true);
                                  }}
                                  className="bg-orange hover:bg-orange text-white font-bold py-2 px-4 rounded transition sm:w-auto"
                                >
                                  <FaEdit />
                                </button>
                              )}
                              {bannerPermissions?.delete && (
                                <button
                                  onClick={() =>
                                    handleDeleteCarousel(carousel?._id)
                                  }
                                  className="bg-red hover:opacity-95 text-white font-bold py-2 px-4 rounded transition sm:w-auto"
                                >
                                  <FaTrashAlt />
                                </button>
                              )}
                              {!bannerPermissions?.edit &&
                                !bannerPermissions?.delete && (
                                  <p className="text-gray-500 mt-2">
                                    Contact admin for more actions.
                                  </p>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div
                    className="flex justify-end items-center mt-5"
                    style={{ height: "3rem" }}
                  >
                    {/* pagination */}
                    <div className="flex items-center border rounded-lg space-x-1 sm:space-x-3 h-8 sm:h-12 px-2 sm:px-4">
                      <button
                        className={`text-blue hover:text-indigo transition duration-200 ease-in-out ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        aria-label="Go to first page"
                      >
                        <ChevronsLeft size={14} />
                      </button>
                      <button
                        className={`text-blue hover:text-indigo transition duration-200 ease-in-out ${
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Go to previous page"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <span className="text-blue text-xs sm:text-lg font-semibold px-1 sm:px-2">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        className={`text-blue hover:text-indigo transition duration-200 ease-in-out ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Go to next page"
                      >
                        <ChevronRight size={14} />
                      </button>
                      <button
                        className={`text-blue hover:text-indigo transition duration-200 ease-in-out ${
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        aria-label="Go to last page"
                      >
                        <ChevronsRight size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {isAddModalOpen && (
            <CarouselAddForm
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleAddNew}
              closeModelWithoutSave={closeModelWithoutSave}
              formData={formData}
              setFormData={handleFormDataChange}
              adding={adding}
            />
          )}

          {isEditModalOpen && currentCarousel && (
            <CarouselEditForm
              onClose={() => setIsEditModalOpen(false)}
              existingData={currentCarousel}
              onSubmit={handleEditCarousel}
              editing={editing}
            />
          )}
        </div>
        <div className="mb-24"></div>
      </div>
    </PrivateRoute>
  );
};

export default CarouselManager;
