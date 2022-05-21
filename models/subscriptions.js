import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class subscriptions extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    licence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'licences',
        key: 'id'
      }
    },
    channel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'channels',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'subscriptions',
    timestamps: false
  });
  }
}
