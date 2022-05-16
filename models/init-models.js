import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _events from  "./events.js";
import _licences from  "./licences.js";
import _releases from  "./releases.js";

export default function initModels(sequelize) {
  const events = _events.init(sequelize, DataTypes);
  const licences = _licences.init(sequelize, DataTypes);
  const releases = _releases.init(sequelize, DataTypes);

  events.belongsTo(licences, { as: "licence_licence", foreignKey: "licence"});
  licences.hasMany(events, { as: "events", foreignKey: "licence"});
  events.belongsTo(releases, { as: "version_release", foreignKey: "version"});
  releases.hasMany(events, { as: "events", foreignKey: "version"});

  return {
    events,
    licences,
    releases,
  };
}
