import { mongo } from 'mongoose';
import StudentModel from '~~/server/models/student.model';

const FIELDS = [
  'SubmissionID',
  'submissionIdUnique',
  'FullName',
  'FirstName',
  'LastName',
  'IEP',
  'Accommodations',
  'CheckIn',
  'CheckOut',
  'TestSession',
] as const;

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!Array.isArray(body) || body.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Body must be a non-empty array of students',
    });
  }

  const invalid = body
    .map((s, i) =>
      s && typeof s.submissionIdUnique === 'string' && s.submissionIdUnique
        ? -1
        : i,
    )
    .filter((i) => i !== -1);
  if (invalid.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Every student must include a string submissionIdUnique',
      data: { invalidIndexes: invalid },
    });
  }

  const ops = body.map((student) => {
    const fields = Object.fromEntries(
      FIELDS.filter((f) => student[f] !== undefined).map((f) => [
        f,
        student[f],
      ]),
    );
    return {
      updateOne: {
        filter: { submissionIdUnique: student.submissionIdUnique },
        update: { $set: fields },
        upsert: true,
      },
    };
  });

  await ConnectDB();
  try {
    const res = await StudentModel.bulkWrite(ops, { ordered: false });
    return {
      matched: res.matchedCount,
      modified: res.modifiedCount,
      inserted: res.upsertedCount,
      errors: [],
    };
  } catch (e) {
    if (!(e instanceof mongo.MongoBulkWriteError)) {
      throw createError({ statusCode: 500, message: (e as Error).message });
    }
    const writeErrors = Array.isArray(e.writeErrors)
      ? e.writeErrors
      : [e.writeErrors];
    return {
      matched: e.result.matchedCount,
      modified: e.result.modifiedCount,
      inserted: e.result.upsertedCount,
      errors: writeErrors.map((w) => ({ index: w.index, message: w.errmsg })),
    };
  }
});
