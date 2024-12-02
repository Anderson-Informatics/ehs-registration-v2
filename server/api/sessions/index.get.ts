import SessionModel from "~~/server/models/session.model";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const sessions = await SessionModel.find(query);
  return sessions;
});
