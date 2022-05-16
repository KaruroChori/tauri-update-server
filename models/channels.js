import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class channels extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'channels',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_channels_1",
        unique: true,
        fields: [
          { name: "label" },
        ]
      },
    ]
  });
  }
}
