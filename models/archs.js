import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class archs extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'archs',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_archs_1",
        unique: true,
        fields: [
          { name: "label" },
        ]
      },
    ]
  });
  }
}
