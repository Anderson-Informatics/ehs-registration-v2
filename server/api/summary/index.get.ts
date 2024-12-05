import SessionModel from "~~/server/models/session.model";
import StudentModel from "~~/server/models/student.model";
import PickupModel from "~~/server/models/pickup.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const sessions = await SessionModel.find(query);
  return sessions;
});
