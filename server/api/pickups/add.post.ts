import PickupModel from '~~/server/models/pickup.model';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  if (query.secret == '2389dsfERGGGH4w32wgfkl') {
    try {
      await PickupModel.create({ ...body });
      return { message: 'Pickup successfully requested' };
    } catch (e) {
      throw createError({
        message: (e as Error).message,
      });
    }
  } else {
    return { message: 'Secret not provided, pickup not recorded' };
  }
});
