import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  address:{
    type:String
  },
  about:{
    type:String
  },
  logo:{
    type:String
  },
  footer:{
    type:String
  },
  age:{
    type:Number
  },
  gender:{
    type:String
  },
  business:{
    type:String
  }
  
});

const Profile = mongoose.model("Profile", profileSchema);

// Use a default export here
export default Profile;
