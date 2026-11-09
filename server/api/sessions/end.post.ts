import SessionModel from '~~/server/models/session.model';
import StudentModel from '~~/server/models/student.model';

export default defineEventHandler(async (event) => {
  // Function to calculate
  const durationCalc = (start: string, end: string) => {
    const t1 = Date.parse(`2024-12-02 ${start}`); //, 'yyyy-MM-dd HH:mm:ss a');
    const t2 = Date.parse(`2024-12-02 ${end}`); //, 'yyyy-MM-dd HH:mm:ss a');
    const time = Math.abs((t2 - t1) / 3600000);

    return time;
  };

  // Get data from body
  const body = await readBody(event);
  // Update a result
  await ConnectDB();
  try {
    const res = await SessionModel.updateOne(
      { _id: body._id },
      { end: body.end, duration: durationCalc(body.start, body.end) },
    );
    console.log(res);
    const result = await StudentModel.updateMany(
      { SubmissionID: { $in: body.students } },
      {
        $set: {
          'TestSession.end': body.end,
          'TestSession.duration': durationCalc(body.start, body.end),
          CheckOut: body.CheckOut,
        },
        upsert: true,
      },
    );
    console.log(result);
    return { message: 'Testing Session Successfully Ended' };
  } catch (e) {
    throw createError({
      message: (e as Error).message,
    });
  }
  //return durationCalc(body.start, body.end);
});
