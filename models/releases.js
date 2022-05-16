import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class releases extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    arch: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    'version-verbose': {
      type: DataTypes.TEXT,
      allowNull: true
    },
    channels: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[\"all\"]"
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    data: {
      type: DataTypes.BLOB,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'releases',
    timestamps: false
  });
  }
}
