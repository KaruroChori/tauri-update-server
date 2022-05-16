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
    release: {
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
    },
    initial: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'events',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_events_1",
        unique: true,
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
  }
}
