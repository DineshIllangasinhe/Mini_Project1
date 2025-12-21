'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'comments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.Ticket, {
      foreignKey: 'ticket_id',
      as: 'ticket',
    });

    Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'author',
    });
  };

  return Comment;
};
