'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Comments,{
        as: 'Comments',
        foreignKey: 'userId',
      });
      this.hasMany(models.Posts,{
        as: 'Posts',
        foreignKey: 'userId',
      });
      this.hasMany(models.likes, {
        as:"likes",
        foreignKey: 'userId'
      })
    }
  }
  Users.init({
    userId: {
      allowNull: false, //Null 허용
      autoIncrement: true, //자동 증가
      primaryKey: true, //기본키 PK
      type:DataTypes.INTEGER
    },
    nickname: {
      unique: true, //유니크
      allowNull: false,
      type:DataTypes.STRING
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};