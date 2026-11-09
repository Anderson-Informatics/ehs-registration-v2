import StudentModel from '~~/server/models/student.model';

export default defineEventHandler(async () => {
  await ConnectDB();
  return StudentModel.find(
    {},
    {
      _id: 1,
      SubmissionID: 1,
      submissionIdUnique: 1,
      FullName: 1,
      FirstName: 1,
      LastName: 1,
      IEP: 1,
      Accommodations: 1,
      CheckIn: 1,
      CheckOut: 1,
      TestSession: 1,
    },
  ).lean();
});
