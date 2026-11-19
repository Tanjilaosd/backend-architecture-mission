import { pool } from "../../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  // check if the user exist => Done
  // check if the password match => Done
  // Check the user status => Done
  // if pass all then generate jwt token => done
  const { email, password } = payload;
  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1


    `,
    [email],
  );
  if (user.rowCount === 0) {
    throw new Error("Invalid credentials!!");
  }
  const matchPassword = await bcrypt.compare(password, user.rows[0].password);
  if (!matchPassword) {
    throw new Error("Invalid credentials");
  }
  // console log(user.rows[0].is_Active)
  if (!user.rows[0].is_active) {
    throw new Error("Access denied");
  }
  const jwtPayload = {
    id: user.rows[0].id,
    email: user.rows[0].email,
  };
  const accessToken = jwt.sign(jwtPayload, "lskdffdskfdsjfds", {
    expiresIn: "1d",
  });
  return accessToken;
};
export const authService = {
  loginUserIntoDB,
};
