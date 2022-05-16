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
    'public-key': {
      type: DataTypes.TEXT,
      allowNull: false
    },
    permissions: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "{}"
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
          { name: "public-key" },
        ]
      },
      {
        name: "licence-list",
        fields: [
          { name: "public-key" },
        ]
      },
    ]
  });
  }
}
