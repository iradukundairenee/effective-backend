import Session from '../../database/model/session.model';

export const createSession = async (req, res, next) => {
  try {
    const { _id: userId, fullName } = req.userData;
    const sessionExists = await Session.findOne({
      userId,
      status: 'active',
    });
    if (sessionExists) {
      return null;
    }
    const session = {
      userId,
      userName: fullName,
      status: 'active',
      startedAt: Date.now(),
    };
    await Session.create(session);
    return res.status(200).json({
      message: 'session created',
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getSessionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await Session.find({
      userId,
    }).sort({ startedAt: -1 });

    return res.status(200).json({
      message: 'Session found',
      sessions,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const destroySession = async (req, res) => {
  try {
    const { _id: userId } = req.userData;
    const session = await Session.findOne({
      userId,
      status: 'active',
    });
    if (!session) {
      return null;
    }
    session.status = 'ended';
    await session.save();
    return res.status(200).json({
      message: 'session ended',
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
