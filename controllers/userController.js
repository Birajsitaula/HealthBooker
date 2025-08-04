// const User = require("../models/userModel");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const Doctor = require("../models/doctorModel");
// const Appointment = require("../models/appointmentModel");

// const getuser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     return res.send(user);
//   } catch (error) {
//     res.status(500).send("Unable to get user");
//   }
// };

// const getallusers = async (req, res) => {
//   try {
//     const users = await User.find()
//       .find({ _id: { $ne: req.locals } })
//       .select("-password");
//     return res.send(users);
//   } catch (error) {
//     res.status(500).send("Unable to get all users");
//   }
// };

// const login = async (req, res) => {
//   try {
//     const emailPresent = await User.findOne({ email: req.body.email });
//     if (!emailPresent) {
//       return res.status(400).send("Incorrect credentials");
//     }
//     const verifyPass = await bcrypt.compare(
//       req.body.password,
//       emailPresent.password
//     );
//     if (!verifyPass) {
//       return res.status(400).send("Incorrect credentials");
//     }
//     const token = jwt.sign(
//       { userId: emailPresent._id, isAdmin: emailPresent.isAdmin },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "2 days",
//       }
//     );
//     return res.status(201).send({ msg: "User logged in successfully", token });
//   } catch (error) {
//     res.status(500).send("Unable to login user");
//   }
// };

// const register = async (req, res) => {
//   try {
//     const emailPresent = await User.findOne({ email: req.body.email });
//     if (emailPresent) {
//       return res.status(400).send("Email already exists");
//     }
//     const hashedPass = await bcrypt.hash(req.body.password, 10);
//     const user = await User({ ...req.body, password: hashedPass });
//     const result = await user.save();
//     if (!result) {
//       return res.status(500).send("Unable to register user");
//     }
//     return res.status(201).send("User registered successfully");
//   } catch (error) {
//     res.status(500).send("Unable to register user");
//   }
// };

// const updateprofile = async (req, res) => {
//   try {
//     const hashedPass = await bcrypt.hash(req.body.password, 10);
//     const result = await User.findByIdAndUpdate(
//       { _id: req.locals },
//       { ...req.body, password: hashedPass }
//     );
//     if (!result) {
//       return res.status(500).send("Unable to update user");
//     }
//     return res.status(201).send("User updated successfully");
//   } catch (error) {
//     res.status(500).send("Unable to update user");
//   }
// };

// const deleteuser = async (req, res) => {
//   try {
//     const result = await User.findByIdAndDelete(req.body.userId);
//     const removeDoc = await Doctor.findOneAndDelete({
//       userId: req.body.userId,
//     });
//     const removeAppoint = await Appointment.findOneAndDelete({
//       userId: req.body.userId,
//     });
//     return res.send("User deleted successfully");
//   } catch (error) {
//     res.status(500).send("Unable to delete user");
//   }
// };

// module.exports = {
//   getuser,
//   getallusers,
//   login,
//   register,
//   updateprofile,
//   deleteuser,
// };

// After Update
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

// Get user by ID (exclude password)
const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    return res.send(user);
  } catch (error) {
    res.status(500).send("Unable to get user");
  }
};

// Get all users except current logged-in user
const getallusers = async (req, res) => {
  try {
    const users = await User.find()
      .find({ _id: { $ne: req.locals } })
      .select("-password");
    return res.send(users);
  } catch (error) {
    res.status(500).send("Unable to get all users");
  }
};

// Login user, issue JWT token
const login = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (!emailPresent) {
      return res.status(400).send("Incorrect credentials");
    }
    const verifyPass = await bcrypt.compare(
      req.body.password,
      emailPresent.password
    );
    if (!verifyPass) {
      return res.status(400).send("Incorrect credentials");
    }
    const token = jwt.sign(
      { userId: emailPresent._id, isAdmin: emailPresent.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "2 days",
      }
    );
    return res.status(201).send({ msg: "User logged in successfully", token });
  } catch (error) {
    res.status(500).send("Unable to login user");
  }
};

// Register new user with hashed password
const register = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (emailPresent) {
      return res.status(400).send("Email already exists");
    }
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = await User({ ...req.body, password: hashedPass });
    const result = await user.save();
    if (!result) {
      return res.status(500).send("Unable to register user");
    }
    return res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Unable to register user");
  }
};

// Update profile with optional password and picture update
const updateprofile = async (req, res) => {
  try {
    const userId = req.locals; // from your auth middleware

    const {
      firstname,
      lastname,
      email,
      age,
      mobile,
      address,
      gender,
      password,
      pic,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    // Update only if fields are provided, otherwise keep existing
    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.age = age || user.age;
    user.mobile = mobile || user.mobile;
    user.address = address || user.address;
    user.gender = gender || user.gender;
    user.pic = pic || user.pic;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    return res.status(200).send("User updated successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Unable to update user");
  }
};

// Delete user and related doctor & appointment data
const deleteuser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.body.userId);
    await Doctor.findOneAndDelete({ userId: req.body.userId });
    await Appointment.deleteMany({ userId: req.body.userId });
    return res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Unable to delete user");
  }
};

module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
};
