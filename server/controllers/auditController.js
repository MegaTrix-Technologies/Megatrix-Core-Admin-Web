import { AuditLog } from '../models/AuditLog.js';

export const getAuditLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      action,
      actorEmail,
      targetType,
      platform,
      search,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (action) {
      query.action = action;
    }

    if (actorEmail) {
      query['actor.email'] = { $regex: actorEmail, $options: 'i' };
    }

    if (targetType) {
      query['target.type'] = targetType;
    }

    if (platform && platform !== 'all') {
      query.platform = platform;
    }

    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { 'actor.name': { $regex: search, $options: 'i' } },
        { 'actor.email': { $regex: search, $options: 'i' } },
        { 'target.name': { $regex: search, $options: 'i' } },
        { 'target.email': { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(take).lean(),
      AuditLog.countDocuments(query),
    ]);

    return res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page, 10),
        limit: take,
        total,
        totalPages: Math.ceil(total / take) || 1,
      },
    });
  } catch (error) {
    console.error('getAuditLogs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve audit logs' });
  }
};

export const exportAuditLogs = async (req, res) => {
  try {
    const { action, platform, startDate, endDate } = req.query;
    const query = {};

    if (action) query.action = action;
    if (platform && platform !== 'all') query.platform = platform;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(1000).lean();

    return res.json({
      success: true,
      count: logs.length,
      exportedAt: new Date().toISOString(),
      logs,
    });
  } catch (error) {
    console.error('exportAuditLogs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to export audit logs' });
  }
};
