import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/Avatar";
import { AuthManager } from "@/lib/auth";

export default function Settings() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => AuthManager.getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      const fresh = AuthManager.getCurrentUser();
      setCurrentUser(fresh);

      if (!fresh) {
        navigate("/login");
        return;
      }

      const user = await AuthManager.getUserById(fresh.userId);
      if (user) {
        setFormData({
          fullName: user.fullName,
          username: user.username,
          email: user.email,
        });
      }
    };

    void run();
  }, [navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");

    // Update user profile
    const result = await AuthManager.updateUser(currentUser!.userId, {
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
    });

    setIsLoading(false);

    if (result.success) {
      setCurrentUser(AuthManager.getCurrentUser());
      setSuccessMessage(result.message);
      setIsEditing(false);
    } else {
      setErrors({ general: result.message });
    }
  };

  const handleCancel = () => {
    const run = async () => {
      if (currentUser) {
        const user = await AuthManager.getUserById(currentUser.userId);
        if (user) {
          setFormData({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
          });
        }
      }
    };
    void run();
    setIsEditing(false);
    setErrors({});
    setSuccessMessage("");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex-1 overflow-auto w-full">
      <div className="p-6 md:p-8 md:px-12 lg:px-20 w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-4">Settings</h1>
        <p className="text-muted-foreground mb-6">
          Manage your profile and account settings.
        </p>

        {/* Profile Section */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="flex items-center gap-6 mb-6">
            <Avatar fullName={currentUser.fullName} size="lg" />
            <div>
              <p className="text-lg font-medium text-foreground">{currentUser.fullName}</p>
              <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
                />
                {errors.fullName && (
                  <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    if (errors.username) setErrors({ ...errors, username: undefined });
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
                />
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:border-primary"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium text-foreground">{currentUser.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Username</p>
                  <p className="font-medium text-foreground">@{currentUser.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground">{currentUser.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium text-foreground">Privacy Mode</p>
                <p className="text-sm text-muted-foreground">Control your privacy settings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm">
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
