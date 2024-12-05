import SessionModel from "~~/server/models/session.model";
import StudentModel from "~~/server/models/student.model"

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  try {
    const res = await SessionModel.updateOne(
        { _id: body._id },
        { end: body.end }
    );
    const result = await StudentModel.updateMany({SubmissionID: { $in: body.students }}, { $set: { "TestSession.end": body.end, "CheckOut": body.CheckOut }});
    console.log(result)
    return { message: "Testing Session Successfully Ended" };
  } catch (e:any) {
    throw createError({
      message: e.message,
    });
  }
});