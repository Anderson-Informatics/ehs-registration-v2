import SessionModel from '~~/server/models/session.model';
import StudentModel from '~~/server/models/student.model';
import PickupModel from '~~/server/models/pickup.model';
import { ConnectDB } from '~/utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
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

  const leftJoin = (objArr1, objArr2, key1, key2) =>
    objArr1.map((anObj1) => ({
      ...objArr2.find((anObj2) => anObj1[key1] === anObj2[key2]),
      ...anObj1,
    }));

  return registrations;
});
