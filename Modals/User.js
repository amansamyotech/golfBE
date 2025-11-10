// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, }
// });

// const User = mongoose.model("User", userSchema);
// export default User;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false, trim: true },
    address: { type: String, required: false, trim: true },
    password: { type: String, required: true },
    role: { type: String }
});

const User = mongoose.model("User", userSchema);
export default User;
