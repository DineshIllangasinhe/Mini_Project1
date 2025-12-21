'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Ticket, {
      foreignKey: 'created_by',
      as: 'createdTickets',
    });

    User.hasMany(models.Ticket, {
      foreignKey: 'assigned_to',
      as: 'assignedTickets',
    });

    User.hasMany(models.Comment, {
      foreignKey: 'user_id',
      as: 'comments',
    });
  };

  return User;
};
