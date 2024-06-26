import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const test = (req, res) => {
  res.json({
    message: "Sign Up API",
  });
};

//SIGN UP

export const signup = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPass = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPass });

  try {
    await newUser.save();
    res.status(201).json("User Created Succesfully");
  } catch (error) {
    // res.status(500).json(error.message);
    // next(errorHandler(550, "Error Occured"));
    next(error);
  }

  await newUser.save();
};

//SIGN IN

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Wrong Credential"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
