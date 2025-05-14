import { ConnectDB } from '~/utils/db';
import PickupModel from '~~/server/models/pickup.model';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  await ConnectDB();
  const pickups = await PickupModel.find(query).sort({ LastName: 'asc' });
  return pickups;
});
