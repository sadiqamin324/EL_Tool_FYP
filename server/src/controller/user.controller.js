// import { User } from "../model/user.model.js"; // Corrected import
// import asyncHandler from "../utils/asyncHandler.js"; // Ensure correct path

// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;

//   // Validate input fields
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "Please enter all fields" });
//   }

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Create the user in the database (password is stored as plain text)
//     const newUser = await User.create({
//       name,
//       email,
//       password, // Storing password as plain text (not recommended for production)
//     });

//     // Respond with the created user (excluding the password)
//     res.status(201).json({
//       id: newUser.id,
//       name: newUser.name,
//       email: newUser.email,
//       createdAt: newUser.createdAt,
//       updatedAt: newUser.updatedAt,
//     });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// export { registerUser };
