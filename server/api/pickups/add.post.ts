import PickupModel from '~~/server/models/pickup.model';

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  try {
    await PickupModel.create({ ...body });
    return { message: 'Pickup successfully requested' };
  } catch (e) {
    throw createError({
      message: (e as Error).message,
    });
  }
});
