'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    'Ticket',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED'),
        defaultValue: 'OPEN',
      },
      priority: {
        type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
        defaultValue: 'LOW',
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'tickets',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator',
    });

    Ticket.belongsTo(models.User, {
      foreignKey: 'assigned_to',
      as: 'assignee',
    });

    Ticket.hasMany(models.Comment, {
      foreignKey: 'ticket_id',
      as: 'comments',
    });
  };

  return Ticket;
};
