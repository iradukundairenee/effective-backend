import Session from '../database/model/session.model';

const createLog = async (req, log) => {
  try {
    // session
    const { _id: userId, fullName } = req.userData;
    const activeSession = await Session.findOne({
      userId,
      status: 'active',
    });

    if (!activeSession) {
      const session = {
        userId,
        userName: fullName,
        status: 'active',
        activities: [log],
        startedAt: Date.now(),
        updatedAt: Date.now(),
      };
      return Session.create(session);
    }

    const now = Date.now();
    const { updatedAt } = activeSession;
    const timeDiff = Math.ceil(
      Math.abs(now - updatedAt) / (1000 * 60 * 60),
    );
    // a session can only last for 12 hrs
    if (timeDiff > 12) {
      // end all active session for a user
      await Session.bulkWrite([
        {
          updateMany: {
            filter: {
              userId,
              status: 'active',
            },
            update: {
              $set: {
                status: 'ended',
              },
            },
          },
        },
      ]);

      const session = {
        userId,
        userName: fullName,
        status: 'active',
        activities: [log],
        startedAt: Date.now(),
        updatedAt: Date.now(),
      };
      return Session.create(session);
    }

    activeSession.activities.push(log);
    activeSession.updatedAt = Date.now();
    await activeSession.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

export default createLog;
