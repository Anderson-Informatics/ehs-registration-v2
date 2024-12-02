import PickupModel from "~~/server/models/pickup.model";

export default defineEventHandler(async (event) => {
  const pickups = await PickupModel.find({});
  return pickups;
});
