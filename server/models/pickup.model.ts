import mongoose from "mongoose";

const schema: mongoose.Schema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    auto: true,
  },
  Departure: mongoose.Schema.Types.Mixed,
  FirstName: String,
  LastName: String,
  PickupDate: String,
  PickupPerson: String,
  PickupPhone: String,
  PickupRelation: String,
  PickupTime: String,
  QID: String,
});

// roster model
export default mongoose.model("Pickup", schema);
