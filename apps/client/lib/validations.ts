export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
};

export const validatePassword = (password: string) => {
  if (!password) return "Password is required";
  if (password.length < 8)
    return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  if (!/[!@#$%^&*]/.test(password))
    return "Password must contain at least one special character (!@#$%^&*)";
  return "";
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

export const validateFullName = (name: string) => {
  if (!name) return "Full name is required";
  if (name.length < 2) return "Full name must be at least 2 characters long";
  if (!/^[a-zA-Z\s]*$/.test(name)) return "Full name can only contain letters and spaces";
  return "";
};
