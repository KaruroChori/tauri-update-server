import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class events extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    licence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'licences',
        key: 'id'
      }
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'releases',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'events',
    timestamps: false
  });
  }
}
