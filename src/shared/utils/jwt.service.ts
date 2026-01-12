import jwt from 'jsonwebtoken';

/**
 * Generate a token JWT using the user email
 * @param userEmail
 * @returns Token JWT
 */
export const generateToken = (userEmail: string): string => {
  const payload = { email: userEmail }; // solo el correo
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
  return token;
};