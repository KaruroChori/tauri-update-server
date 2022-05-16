import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class licences extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    secret: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'licences',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_licences_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "sqlite_autoindex_licences_2",
        unique: true,
        fields: [
          { name: "secret" },
        ]
      },
    ]
  });
  }
}
