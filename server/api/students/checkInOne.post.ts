import StudentModel from '~~/server/models/student.model';

export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  try {
    const res = await StudentModel.updateOne(
      { submissionIdUnique: body.submissionIdUnique },
      { CheckIn: body.CheckIn },
    );
    if (res.matchedCount === 1) {
      return { message: 'Check In Successfully Completed' };
    } else {
      return { message: 'No Student Found' };
    }
  } catch (e) {
    throw createError({
      message: (e as Error).message,
    });
  }
});
