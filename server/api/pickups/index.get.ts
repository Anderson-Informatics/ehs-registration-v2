import PickupModel from "~~/server/models/pickup.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const pickups = await PickupModel.find(query);
  return pickups;
});
