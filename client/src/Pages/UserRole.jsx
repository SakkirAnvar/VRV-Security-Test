import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import RoleFormModal from "../Form/RoleFormModal";
import EditRoleForm from "../Form/EditRoleForm";
import {
  useGetFilteredRolesQuery,
  useDeleteRoleMutation,
} from "../api/roleApiSlice";
import { CSVLink } from "react-csv";
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

const UserRole = () => {
  const user = useSelector((state) => state.auth);
  const { userRole, permissions } = user;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Lifted form state
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    permissions: {
      subUser: { view: false, create: false, edit: false, delete: false },
      roles: { view: false, create: false, edit: false, delete: false },
      banner: { view: false, create: false, edit: false, delete: false },
    },
  });

  const { data, isLoading, isError, error, refetch } = useGetFilteredRolesQuery(
    {
      search: searchTerm,
      page: currentPage,
      limit: itemsPerPage,
    }
  );

  const [deleteRole] = useDeleteRoleMutation();

  const { data: settingsData } = useGetSettingsDataQuery({ id: user?._id });
  const tableHeadBg = settingsData?.settingsData?.tableHeadBg || "#206bc4";
  const tableHeadText = settingsData?.settingsData?.tableHeadText || "white";
  const checkboxValues = settingsData?.settingsData;

  useEffect(() => {
    if (settingsData?.settingsData?.pagenationLimit) {
      setItemsPerPage(settingsData?.settingsData?.pagenationLimit);
    }
  }, [settingsData]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = (action) => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setEditRoleId(null);
    refetch();
    setFormData({
      roleName: "",
      description: "",
      permissions: {
        subUser: { view: false, create: false, edit: false, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
        banner: { view: false, create: false, edit: false, delete: false },
        // aboutPage: { view: false, create: false, edit: false, delete: false },
        // bookingCards: {
        //   view: false,
        //   create: false,
        //   edit: false,
        //   delete: false,
        // },
        packagesCards: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        testimonials: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        metaTagsAccess: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        category: { view: false, create: false, edit: false, delete: false },
        enquiry: { view: false, create: false, edit: false, delete: false },
        blogs: { view: false, create: false, edit: false, delete: false },
        destination: { view: false, create: false, edit: false, delete: false },
        newsLetter: { view: false, create: false, edit: false, delete: false },
        contact: { view: false, create: false, edit: false, delete: false },
        faqs: { view: false, create: false, edit: false, delete: false },
      },
    });

    if (action) {
      alert(`Role ${action} successfully!`);
    }
  };
  const closeModelWithoutSave = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };
  const handleFormDataChange = (newFormData) => {
    setFormData(newFormData);
  };

  const handleEdit = (roleId) => {
    setEditRoleId(roleId);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const response = await deleteRole({ id: roleId }).unwrap();
        alert(response?.message || "Role deleted successfully!");
        refetch();
      } catch (error) {
        if (error?.status === 401) {
          dispatch(setLogout());
          navigate("/login");
          return;
        }
        alert(error?.data?.error || "Failed to delete role.");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages || 1;
  const currentRoles = (data?.roles || []).filter(
    (role) => role?.roleName !== "admin"
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      refetch();
    }
  };

  // Refetch data when the current page changes
  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const formatPermissions = (roles) => {
    return roles.map((role) => {
      const permissions = role?.permissions;

      // Extract roleName and description for use in each permission section
      const roleNameAndDescription = `${role?.roleName} - ${role?.description}`;

      return {
        RoleNameAndDescription: roleNameAndDescription,

        // SubUser Permissions
        SubUserCreate: permissions.subUser?.create ?? "False",
        SubUserView: permissions.subUser?.view ?? "False",
        SubUserEdit: permissions.subUser?.edit ?? "False",
        SubUserDelete: permissions.subUser?.delete ?? "False",

        // Roles Permissions
        RolesCreate: permissions.roles?.create ?? "False",
        RolesView: permissions.roles?.view ?? "False",
        RolesEdit: permissions.roles?.edit ?? "False",
        RolesDelete: permissions.roles?.delete ?? "False",

        // Banner Permissions
        BannerCreate: permissions.banner?.create ?? "False",
        BannerView: permissions.banner?.view ?? "False",
        BannerEdit: permissions.banner?.edit ?? "False",
        BannerDelete: permissions.banner?.delete ?? "False",

        // AboutPage Permissions
        // AboutPageCreate: permissions.aboutPage?.create ?? "False",
        // AboutPageView: permissions.aboutPage?.view ?? "False",
        // AboutPageEdit: permissions.aboutPage?.edit ?? "False",
        // AboutPageDelete: permissions.aboutPage?.delete ?? "False",

        // BookingCards Permissions
        // BookingCardsCreate: permissions.bookingCards?.create ?? "False",
        // BookingCardsView: permissions.bookingCards?.view ?? "False",
        // BookingCardsEdit: permissions.bookingCards?.edit ?? "False",
        // BookingCardsDelete: permissions.bookingCards?.delete ?? "False",

        // PackagesCards Permissions
        PackagesCardsCreate: permissions.packagesCards?.create ?? "False",
        PackagesCardsView: permissions.packagesCards?.view ?? "False",
        PackagesCardsEdit: permissions.packagesCards?.edit ?? "False",
        PackagesCardsDelete: permissions.packagesCards?.delete ?? "False",

        // Testimonials Permissions
        TestimonialsCreate: permissions.testimonials?.create ?? "False",
        TestimonialsView: permissions.testimonials?.view ?? "False",
        TestimonialsEdit: permissions.testimonials?.edit ?? "False",
        TestimonialsDelete: permissions.testimonials?.delete ?? "False",

        // Blogs Permissions
        BlogsCreate: permissions.blogs?.create ?? "False",
        BlogsView: permissions.blogs?.view ?? "False",
        BlogsEdit: permissions.blogs?.edit ?? "False",
        BlogsDelete: permissions.blogs?.delete ?? "False",

        // MetaTags Permissions
        MetaTagsCreate: permissions.metaTags?.create ?? "False",
        MetaTagsView: permissions.metaTags?.view ?? "False",
        MetaTagsEdit: permissions.metaTags?.edit ?? "False",
        MetaTagsDelete: permissions.metaTags?.delete ?? "False",

        // Category Permissions
        CategoryCreate: permissions.category?.create ?? "False",
        CategoryView: permissions.category?.view ?? "False",
        CategoryEdit: permissions.category?.edit ?? "False",
        CategoryDelete: permissions.category?.delete ?? "False",

        // Enquiry Permissions
        EnquiryCreate: permissions.enquiry?.create ?? "False",
        EnquiryView: permissions.enquiry?.view ?? "False",
        EnquiryEdit: permissions.enquiry?.edit ?? "False",
        EnquiryDelete: permissions.enquiry?.delete ?? "False",

        // Destination Permissions
        DestinationCreate: permissions.destination?.create ?? "False",
        DestinationView: permissions.destination?.view ?? "False",
        DestinationEdit: permissions.destination?.edit ?? "False",
        DestinationDelete: permissions.destination?.delete ?? "False",

        // NewsLetter Permissions
        NewsLetterCreate: permissions.newsLetter?.create ?? "False",
        NewsLetterView: permissions.newsLetter?.view ?? "False",
        NewsLetterEdit: permissions.newsLetter?.edit ?? "False",
        NewsLetterDelete: permissions.newsLetter?.delete ?? "False",

        // Contact Permissions
        ContactCreate: permissions.contact?.create ?? "False",
        ContactView: permissions.contact?.view ?? "False",
        ContactEdit: permissions.contact?.edit ?? "False",
        ContactDelete: permissions.contact?.delete ?? "False",

        // faq Permissions
        FaqCreate: permissions.faq?.create ?? "False",
        FaqView: permissions.faq?.view ?? "False",
        FaqEdit: permissions.faq?.edit ?? "False",
        FaqDelete: permissions.faq?.delete ?? "False",
      };
    });
  };

  const isAdmin = userRole === "admin";
  const rolesPermissions = isAdmin
    ? {
        view: true,
        create: true,
        edit: true,
        delete: true,
      }
    : permissions?.roles || {};

  return (
    <PrivateRoute isComponentLoading={isLoading}>
      <div className="bg-gray-100 min-h-screen pt-[80px] py-8">
        <div className="md:container md:mx-auto md:px-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-row justify-between items-center mb-4">
              <h2 className="text-sm sm:text-2xl font-bold text-gray-800">
                User Role
              </h2>
              {rolesPermissions?.create && (
                <button
                  onClick={openModal}
                  className="bg-blue text-white hover:bg-blue rounded-lg px-4 py-1 text-xs sm:text-base sm:px-6 sm:py-2"
                >
                  + Add New
                </button>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Filter
              </h3>
              <hr className="mb-4" />
              <div>
                <label
                  htmlFor="role-search"
                  className="font-medium text-gray-700 mb-2 block"
                >
                  Search:
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                  <input
                    type="text"
                    id="role-search"
                    className="border border-gray-300 rounded-lg p-2 flex-grow sm:flex-grow-0 sm:w-48 mb-4 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder="Role Name"
                    value={searchTerm}
                    autoComplete="off"
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                User Role List
              </h3>

              <div className="w-full table">
                {isError ? (
                  <ErrorMessage
                    message={error?.data?.message || "Error loading user roles"}
                  />
                ) : (
                  <>
                    <table className="min-w-full  bg-white shadow-sm rounded-lg text-sm">
                      <thead>
                        <tr
                          style={{
                            backgroundColor: tableHeadBg,
                            color: tableHeadText,
                          }}
                        >
                          <th
                            className={`p-3 text-left ${
                              checkboxValues?.tableBorder
                                ? "border border-gray-300"
                                : ""
                            }`}
                          >
                            No
                          </th>
                          <th
                            className={`p-3 text-left ${
                              checkboxValues?.tableBorder
                                ? "border border-gray-300"
                                : ""
                            }`}
                          >
                            Role Name
                          </th>
                          <th
                            className={`p-3 text-left ${
                              checkboxValues?.tableBorder
                                ? "border border-gray-300"
                                : ""
                            }`}
                          >
                            Description
                          </th>
                          <th
                            className={`p-3 text-center ${
                              checkboxValues?.tableBorder
                                ? "border border-gray-300"
                                : ""
                            }`}
                            style={{ width: "150px" }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRoles?.map((role, index) => (
                          <tr
                            key={role?._id}
                            className={`${
                              checkboxValues?.tableStripped
                                ? "even:bg-white odd:bg-gray-50"
                                : ""
                            } ${
                              checkboxValues?.tableHover
                                ? "hover:bg-gray-100"
                                : ""
                            } ${
                              checkboxValues?.tableBorder
                                ? "border-b border-gray-300"
                                : ""
                            }`}
                          >
                            <td
                              className={`p-3 ${
                                checkboxValues?.tableBorder
                                  ? "border border-gray-300"
                                  : ""
                              }`}
                            >
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td
                              className={`p-3 ${
                                checkboxValues?.tableBorder
                                  ? "border border-gray-300"
                                  : ""
                              }`}
                            >
                              {role?.roleName}
                            </td>
                            <td
                              className={`p-3 ${
                                checkboxValues?.tableBorder
                                  ? "border border-gray-300"
                                  : ""
                              }`}
                            >
                              {role?.description}
                            </td>
                            <td
                              className={`p-3 text-center ${
                                checkboxValues?.tableBorder
                                  ? "border border-gray-300"
                                  : ""
                              }`}
                              style={{ width: "150px" }}
                            >
                              {!isAdmin &&
                              role?.roleName === "greenbookadmin" ? (
                                <span className="text-gray-600">Admin</span>
                              ) : (
                                <div className="flex justify-center space-x-2">
                                  {rolesPermissions?.edit && (
                                    <button
                                      onClick={() => handleEdit(role?._id)}
                                      disabled={
                                        !isAdmin && role?.roleName === userRole
                                      }
                                      className="bg-orange hover:bg-orange text-white font-bold py-1 px-2 rounded flex items-center text-sm"
                                    >
                                      <FaEdit />
                                    </button>
                                  )}
                                  {rolesPermissions?.delete && (
                                    <button
                                      onClick={() => handleDelete(role?._id)}
                                      disabled={
                                        !isAdmin && role?.roleName === userRole
                                      }
                                      className="bg-red hover:bg-red text-white font-bold py-1 px-2 rounded flex items-center text-sm"
                                    >
                                      <FaTrashAlt />
                                    </button>
                                  )}
                                  {!rolesPermissions?.edit &&
                                    !rolesPermissions?.delete && (
                                      <p className="text-gray-500 mt-2">
                                        Contact admin for more actions.
                                      </p>
                                    )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-between items-center mt-6">
                      <CSVLink
                        data={formatPermissions(currentRoles)}
                        filename="roles_list.csv"
                        className="bg-indigo text-white hover:bg-blue rounded-lg px-4 py-1 text-xs sm:px-6 sm:py-2 sm:text-base"
                      >
                        Download CSV
                      </CSVLink>

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
                        <span className="text-blue text-sm md:text-xl font-semibold px-1 sm:px-2">
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

            {isModalOpen && (
              <RoleFormModal
                closeModal={() => closeModal("added")}
                closeModelWithoutSave={closeModelWithoutSave}
                formData={formData}
                setFormData={handleFormDataChange}
              />
            )}

            {isEditModalOpen && (
              <EditRoleForm
                roleId={editRoleId}
                closeModal={() => closeModal("updated")}
                closeModelWithoutSave={closeModelWithoutSave}
              />
            )}
          </div>
        </div>
        <div className="mb-24"></div>
      </div>
    </PrivateRoute>
  );
};

export default UserRole;
