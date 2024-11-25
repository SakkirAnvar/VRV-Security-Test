import logo from "/images/loaderlogo.png";

const Loader = ({ size = "w-24 h-24" }) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className={`relative ${size} flex justify-center items-center`}>
        <div
          className={`relative ${size} p-4 flex justify-center items-center`}
        >
          <img src={logo} alt="Logo" className={`${size} rounded-full`} />

          <div
            className={`absolute inset-0 border-t-4 border-green rounded-full animate-spin-slow`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
