import StudentModel from '~~/server/models/student.model';

export default defineEventHandler(async () => {
  await ConnectDB();
  const agg = [
    {
      $project: {
        _id: 0,
        SubmissionID: 1,
        CheckIn: {
          $cond: [
            {
              $eq: ['$CheckIn.Registered', true],
            },
            '$CheckIn.Date',
            null,
          ],
        },
        Registered: {
          $cond: [
            {
              $eq: ['$CheckIn.Registered', true],
            },
            1,
            0,
          ],
        },
        CheckOut: {
          $cond: [
            {
              $eq: ['$CheckOut.CheckedOut', true],
            },
            '$CheckOut.Date',
            null,
          ],
        },
        Completed: {
          $cond: [
            {
              $eq: ['$CheckOut.CheckedOut', true],
            },
            1,
            0,
          ],
        },
      },
    },
    {
      $group: {
        _id: '$CheckIn',
        Registered: {
          $sum: '$Registered',
        },
        Completed: {
          $sum: '$Completed',
        },
      },
    },
  ];
  const registrations = await StudentModel.aggregate(agg);

  return registrations;
});
