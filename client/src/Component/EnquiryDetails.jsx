import { useState } from "react";
import {
  useEditEnquiryMutation,
  useGetSingleEnquiryQuery,
} from "../api/enquiryApiSlice";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../auth/authSlice";

export default function EnquiryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, refetch } = useGetSingleEnquiryQuery(id);
  const enquiry = data?.data || {};
  const [editEnquiry] = useEditEnquiryMutation();
  const [status, setStatus] = useState(enquiry?.status);
  const [newComment, setNewComment] = useState("");
  const { user } = useSelector((state) => state.auth);

  const handleEnquiryUpdate = async (e) => {
    e.preventDefault();
    try {
      await editEnquiry({ id, data: { status } });
      navigate("/dashboard/enquiry");
    } catch (error) {
      if (error?.status === 401) {
        dispatch(setLogout());
        navigate("/login");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCommentObject = {
        comment: newComment,
        commentedBy: user?._id,
        commentedAt: new Date(),
      };
      const updatedComments = [...(enquiry?.comment || []), newCommentObject];
      await editEnquiry({ id, data: { status, comment: updatedComments } });
      setNewComment("");
      refetch();
    } catch (error) {
      if (error.status === 401) {
        dispatch(setLogout());
        navigate("/login");
      }
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const dateObject = new Date(enquiry?.createdAt);
  const enquiryTime = dateObject?.toLocaleString();

  return (
    <div className="container mx-auto px-4 pt-20 pb-10">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 bg-white rounded-lg shadow-lg p-2">
          <div className="bg-white p-3 rounded-t-lg">
            <div className="flex justify-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Enquiry Details
              </h2>
            </div>
          </div>

          {/* Divider Line */}
          <hr className="border-t border-gray-300" />

          {/* Form Section */}
          <div className="p-4 rounded-b-lg">
            <form onSubmit={handleEnquiryUpdate} className="space-y-4">
              {/* First Name and Last Name */}
              <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={enquiry?.firstName}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={enquiry?.lastName}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={enquiry?.email}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={enquiry?.phone}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              {/* Country and Budget */}
              <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={enquiry?.country}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Budget
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={enquiry?.budget}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              {/* Travelling With and Date */}
              <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Travelling With
                  </label>
                  <input
                    type="text"
                    name="travelType"
                    value={enquiry?.travelType}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="text"
                    name="dates"
                    value={enquiry?.dates}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              {/* Number of Adults and Children */}
              <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Adults
                  </label>
                  <input
                    type="text"
                    name="numberOfAdults"
                    value={enquiry?.numberOfAdults}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Children
                  </label>
                  <input
                    type="text"
                    name="numberOfChildrens"
                    value={enquiry?.numberOfChildrens}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              {/* Selected Destinations and Known About Us */}
              <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Selected Destinations
                  </label>
                  <input
                    type="text"
                    name="selectedDestinations"
                    value={enquiry?.selectedDestinations?.join(", ")}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Known About Us
                  </label>
                  <input
                    type="text"
                    name="knownAboutUs"
                    value={enquiry?.knownAboutUs}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              {/* More Information and First Option */}
              <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    More Information
                  </label>
                  <input
                    type="text"
                    name="moreInformation"
                    value={enquiry?.moreInformation}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    First Option
                  </label>
                  <input
                    type="text"
                    name="selectedOption"
                    value={enquiry?.selectedOption}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              {/* Enquiry Time and Status */}
              <div className="flex flex-col lg:flex-row justify-between mb-4 gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Enquiry Time
                  </label>
                  <input
                    type="text"
                    name="enquiryTime"
                    value={enquiryTime}
                    readOnly
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Status<span className="text-red">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="status"
                      value={status}
                      onChange={handleStatusChange}
                      required
                      className="w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-green text-white hover:opacity-90 px-6 py-2 rounded-lg flex-shrink-0"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full md:w-2/5 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Comments</h2>
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              className="w-full border rounded-lg p-2 mb-2"
              placeholder="Write New Comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-green text-white hover:opacity-90 px-6 py-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
          <table className="min-w-full border-collapse bg-white shadow-sm rounded-lg text-sm">
            <thead>
              <tr className="bg-blue text-white">
                <th className="p-2">No</th>
                <th className="p-2">Comment</th>
                <th className="p-2">Commented By &amp; At</th>
              </tr>
            </thead>
            <tbody>
              {enquiry?.comment?.map((comment, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{comment?.comment}</td>
                  <td className="p-2">
                    {comment?.commentedBy?.userName} <br />
                    {new Date(comment?.commentedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
