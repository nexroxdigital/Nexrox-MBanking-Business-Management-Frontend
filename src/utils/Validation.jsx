import { motion } from "framer-motion";

const charLengthCheck = /^.{6,}$/;
const uppercaseCheck = /[A-Z]/;
const lowercaseCheck = /[a-z]/;

const errorMsg = (text) => (
  <motion.p
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-2 text-sm text-red-600 dark:text-red-400"
  >
    {text}
  </motion.p>
);

export const validateForm = (formData, setErrors) => {
  const { name, email, password, confirmPassword, photoURL, terms } = formData;

  if (!name.trim()) {
    setErrors((prev) => ({
      ...prev,
      name: errorMsg("Required!"),
    }));
    return false;
  }

  if (!email) {
    setErrors((prev) => ({
      ...prev,
      email: errorMsg("Please provide your email!"),
    }));
    return false;
  }

  if (!photoURL) {
    setErrors((prev) => ({
      ...prev,
      photoURL: errorMsg("Oops! Don’t forget to add your photo URL!"),
    }));
    return false;
  }

  if (!password) {
    setErrors((prev) => ({
      ...prev,
      password: errorMsg("Please provide your Password!"),
    }));
    return false;
  } else if (!charLengthCheck.test(password)) {
    setErrors((prev) => ({
      ...prev,
      password: errorMsg("Password must be at least 6 characters long!"),
    }));
    return false;
  } else if (!uppercaseCheck.test(password)) {
    setErrors((prev) => ({
      ...prev,
      password: errorMsg(
        "Password must contain at least one uppercase letter!"
      ),
    }));
    return false;
  } else if (!lowercaseCheck.test(password)) {
    setErrors((prev) => ({
      ...prev,
      password: errorMsg(
        "Password must contain at least one lowercase letter!"
      ),
    }));
    return false;
  }

  if (!confirmPassword) {
    setErrors((prev) => ({
      ...prev,
      confirmPassword: errorMsg("Please confirm your password!"),
    }));
    return false;
  } else if (password !== confirmPassword) {
    setErrors((prev) => ({
      ...prev,
      confirmPassword: errorMsg("Passwords do not match!"),
    }));
    return false;
  }

  if (!terms) {
    setErrors((prev) => ({
      ...prev,
      terms: errorMsg("You must accept the Terms and Conditions!"),
    }));
    return false;
  }

  return true;
};

export const validateAddArtifactForm = (formData, setErrors) => {
  const {
    artifactName,
    artifactImage,
    artifactType,
    historicalContext,
    shortDescription,
    createdAt,
    discoveredAt,
    discoveredBy,
    presentLocation,
  } = formData;

  if (!artifactName.trim()) {
    setErrors((prev) => ({
      ...prev,
      artifactName: errorMsg("Please enter the artifact's name"),
    }));
    return false;
  }

  if (!artifactImage.trim()) {
    setErrors((prev) => ({
      ...prev,
      artifactImage: errorMsg("Please upload an image of the artifact"),
    }));
    return false;
  }

  if (!artifactType.trim()) {
    setErrors((prev) => ({
      ...prev,
      artifactType: errorMsg("Please select the artifact type"),
    }));
    return false;
  }

  if (!historicalContext.trim()) {
    setErrors((prev) => ({
      ...prev,
      historicalContext: errorMsg("Please provide historical context"),
    }));
    return false;
  }

  if (!shortDescription.trim()) {
    setErrors((prev) => ({
      ...prev,
      shortDescription: errorMsg("Please write a brief description"),
    }));
    return false;
  }

  if (!createdAt.trim()) {
    setErrors((prev) => ({
      ...prev,
      createdAt: errorMsg("Please estimate when this was created"),
    }));
    return false;
  }

  if (!discoveredAt.trim()) {
    setErrors((prev) => ({
      ...prev,
      discoveredAt: errorMsg("Please provide discovery date"),
    }));
    return false;
  }

  if (!discoveredBy.trim()) {
    setErrors((prev) => ({
      ...prev,
      discoveredBy: errorMsg("Please name the discoverer"),
    }));
    return false;
  }

  if (!presentLocation.trim()) {
    setErrors((prev) => ({
      ...prev,
      presentLocation: errorMsg("Please specify current location"),
    }));
    return false;
  }
  return true;
};
