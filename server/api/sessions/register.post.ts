import SessionModel from "~~/server/models/session.model";
import StudentModel from "~~/server/models/student.model";

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  try {
    const res = await SessionModel.updateOne(
        { _id: body.session._id },
        { $push: {students: body.student} }
    );
    const result = StudentModel.updateOne({SubmissionID: body.student.SubmissionID}, { TestSession: body.session });
    return result
    //return { message: "Student Added to Session" };
  } catch (e:any) {
    throw createError({
      message: e.message,
    });
  }
});