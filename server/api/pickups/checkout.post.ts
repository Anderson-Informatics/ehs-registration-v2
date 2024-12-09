import { ConnectDB } from "~/utils/db";
import PickupModel from "~~/server/models/pickup.model";

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  try {
      const res = await PickupModel.updateOne(
          { QID: body.QID },
          { Departure: body.Departure }
      );
      return { message: "Checkout successfully completed" };
  } catch (e:any) {
      throw createError({
        message: e.message,
      });
  }
});
