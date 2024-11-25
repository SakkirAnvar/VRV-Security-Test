import {
  FaUsers,
  FaUserShield,
  FaAd,
  FaInfoCircle,
  FaCalendarAlt,
  FaEnvelope,
  FaEnvelopeOpenText,
  FaMapMarkerAlt,
  FaGift,
  FaQuoteLeft,
  FaBloggerB,
  FaQuestionCircle,
} from "react-icons/fa";
import { MdTag, MdHelpOutline, MdCategory } from "react-icons/md";
import Cards from "../assets/Cards";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useCheckUserStatus from "../utils/useCheckUserStatus";

function DashBoard() {
  useCheckUserStatus();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const { userName, userRole, permissions } = user;

  const items = [
    {
      icon: <FaUserShield />,
      title: "User Roles",
      style: "bg-purple",
      path: "/dashboard/user_roles",
      permissionKey: "roles.view",
    },
    {
      icon: <FaUsers />,
      title: "Sub Users",
      style: "bg-blue",
      path: "/dashboard/subuser",
      permissionKey: "subUser.view",
    },
    {
      icon: <FaAd />,
      title: "Banner",
      style: "bg-green",
      path: "/dashboard/banner",
      permissionKey: "banner.view",
    },
  ];

  // Filter items based on permissions or show all if admin
  const filteredItems =
    userRole === "admin"
      ? items
      : items.filter((item) => {
          const keys = item?.permissionKey?.split(".");
          return (
            permissions && permissions[keys[0]] && permissions[keys[0]][keys[1]]
          );
        });

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center pt-20 px-4 lg:px-16">
      <div className="container mx-auto flex-grow">
        <div className="p-2">
          <div>
            <p className="text-gray font-medium text-xs">OVERVIEW</p>
            <h1 className="m-0 text-lg leading-snug font-semibold text-inherit flex items-center">
              Dashboard
            </h1>
          </div>
          <div className="flex justify-center items-center mt-2">
            <h1 className="font-medium text-lg text-center">
              Hi <span className="text-red text-xl font-bold">{userName},</span>{" "}
              Welcome to Site.
            </h1>
          </div>
        </div>
        <hr className="w-full border-gray-300 my-6" />

        {/* Cards Section */}
        <div className="flex flex-wrap justify-center mx-3 md:mx-0">
          {filteredItems?.length > 0 ? (
            filteredItems?.map((card, index) => (
              <Cards
                key={index}
                title={card?.title}
                icon={card?.icon}
                style={card?.style}
                handleNavigate={() => handleCardClick(card?.path)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">
              No available items to display.
            </p>
          )}
        </div>
      </div>
      <div className="mb-24"></div>
    </div>
  );
}

export default DashBoard;
