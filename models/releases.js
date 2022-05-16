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
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'archs',
        key: 'id'
      },
      unique: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    channel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'channels',
        key: 'id'
      },
      unique: true
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'releases',
    timestamps: false,
    indexes: [
      {
        name: "unique_release",
        unique: true,
        fields: [
          { name: "arch" },
          { name: "version" },
          { name: "channel" },
        ]
      },
    ]
  });
  }
}
