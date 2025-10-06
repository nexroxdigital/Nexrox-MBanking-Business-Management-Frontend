import { Lock, LogOut, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import GradientButton from "../components/shared/Button/GradientButton";
import {
  useAuth,
  useUpdateUserImage,
  useUploadToCloudinary,
} from "../hooks/useAuth";

import { MdOutlineEdit } from "react-icons/md";

const Navbar = ({ toggleMenu, isMenuOpen }) => {
  const { isLoggedIn, user } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const uploadImageMutation = useUploadToCloudinary();
  const updateUserImageMutation = useUpdateUserImage();

  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file) {
      // Show preview instantly
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }

    try {
      // Upload to Cloudinary directly
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "mbanking_user");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dhtpxepmr/image/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();

      // Get the uploaded image URL
      const imageUrl = data.secure_url;

      // Call your backend hook to update image in DB
      uploadImageMutation.mutate(imageUrl, {
        onSuccess: (imageUrl) => {
          // instantly send image URL to backend
          updateUserImageMutation.mutate({ image: imageUrl });
        },
      });
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowProfileMenu(false);
    navigate("/login"); // redirect to login
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#f5f5f5] sticky z-50 top-0 dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img className="h-14 w-32" src="/Ai.png" alt="Logo" />
          </Link>

          <div className="flex items-center space-x-3 relative">
            {/* If user logged in → show profile */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                {/* Profile avatar button */}
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="focus:outline-none flex items-center"
                >
                  <img
                    src={previewImage || user?.image}
                    alt="Profile"
                    className="w-12 h-12 rounded-full border-2 border-[#009C91] hover:scale-105 transition-transform duration-200 object-cover"
                  />
                </button>

                {/* Dropdown menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 transition-all p-4 animate-fade-in z-50">
                    <div className="flex flex-col items-center text-center relative">
                      {/* Profile image + edit icon */}
                      <div className="relative group">
                        <img
                          src={previewImage || user?.image}
                          alt="Profile"
                          className="w-14 h-14 rounded-full border mb-2 object-cover"
                        />

                        {/* hidden file input */}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="upload-avatar"
                          onChange={handleImageChange}
                        />

                        {/* edit icon */}
                        <label
                          htmlFor="upload-avatar"
                          className="absolute bottom-1 right-1 bg-[#009C91] text-white p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <MdOutlineEdit size={16} />
                        </label>
                      </div>

                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {user?.username}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {user?.role || "Admin"}
                      </p>

                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 mt-1 text-white rounded-lg font-semibold transition-transform transform hover:scale-[1.03]"
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // If not logged in → show Login button
              <div className="hidden lg:flex">
                <GradientButton label="Login" icon={Lock} to="/login" />
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
