import StudentModel from "~~/server/models/student.model";

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  try {
    const res = await StudentModel.updateOne(
        { submissionIdUnique: body.submissionIdUnique },
        { CheckIn: body.CheckIn }
    );
    return { message: "Check In Successfully Completed" };
  } catch (e) {
    throw createError({
      message: e.message,
    });
    return { message };
  }
});
