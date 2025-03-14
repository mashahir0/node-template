import UserModel from "../../domain/models/userModel";
import { IUser, User } from "../../domain/User";
import userModel from "../../domain/models/userModel";

const UserRepository = {
  async save(user: User) {
    return await new UserModel(user).save();
  },
  async findByEmail(email: string) {
    return await UserModel.findOne({ email });
  },
  async findById(id: string) {
    return await UserModel.findById(id).select('-password').exec();
  },
  async getAllUsers() {
    return await UserModel.find().select('-password').exec();
  },
  async findAndDelete(id :string){
    return await userModel.findByIdAndDelete(id)  
  }
};

export default UserRepository;
