import crypto from "crypto";

export const generateStrongPassword = (length = 12) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "@#$%&*!?";

  const allCharacters = uppercase + lowercase + numbers + symbols;

  if (length < 8) {
    throw new Error("Password length should be at least 8 characters");
  }

  let password = "";

  password += uppercase[crypto.randomInt(0, uppercase.length)];
  password += lowercase[crypto.randomInt(0, lowercase.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += symbols[crypto.randomInt(0, symbols.length)];

  for (let i = password.length; i < length; i++) {
    password += allCharacters[crypto.randomInt(0, allCharacters.length)];
  }

  return password
    .split("")
    .sort(() => crypto.randomInt(0, 3) - 1)
    .join("");
};