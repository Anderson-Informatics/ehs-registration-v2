import StudentModel from '~~/server/models/student.model';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!Array.isArray(body) || body.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Body must be a non-empty array of submissionIdUnique',
    });
  }

  const invalid = body
    .map((id, i) => (typeof id === 'string' && id ? -1 : i))
    .filter((i) => i !== -1);
  if (invalid.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Every submissionIdUnique must be a non-empty string',
      data: { invalidIndexes: invalid },
    });
  }

  const ids: string[] = [...new Set(body as string[])];
  await ConnectDB();
  const existing = await StudentModel.distinct('submissionIdUnique', {
    submissionIdUnique: { $in: ids },
  });
  const res = await StudentModel.deleteMany({
    submissionIdUnique: { $in: existing },
  });
  return {
    requested: ids.length,
    deleted: res.deletedCount,
    notFound: ids.filter((id) => !existing.includes(id)),
  };
});
