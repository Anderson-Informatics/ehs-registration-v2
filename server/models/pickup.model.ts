import mongoose from "mongoose";

const departureSchema = new mongoose.Schema(
  { 
    Date: String,
    Time: String,
    Timestamp: String,
    PickedUp: Boolean,
  },
  { _id: false } // <-- disable `_id`
);

const schema: mongoose.Schema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  Departure: departureSchema,
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
