import mongoose, { Document, Schema } from "mongoose";

mongoose.connect(
  `mongodb+srv://arnav:arnavsharma1A@cluster0.n9borfi.mongodb.net/paytm`,
);

interface User {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

const userSchema = new Schema<User & Document>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

const Users = mongoose.model<User & Document>("User", userSchema);

interface Account {
  userId: mongoose.Types.ObjectId | User;
  balance: number;
}

const accountSchema = new Schema<Account & Document>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

export const Accounts = mongoose.model<Account & Document>(
  "Account",
  accountSchema,
);

export default Users;
