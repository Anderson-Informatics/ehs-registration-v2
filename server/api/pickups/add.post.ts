import PickupModel from "~~/server/models/pickup.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  // Get data from body
  const body = await readBody(event);
  // Update a result
  if (query.secret == '2389dsfERGGGH4w32wgfkl') {
    try {
      const res = await PickupModel.create(
          { ...body }
      );
      return { message: "Pickup successfully requested" };
    } catch (e:any) {
      throw createError({
        message: e.message,
      });
    }
  } else {
    return { message: "Secret not provided, pickup not recorded"}
  }
  
});
