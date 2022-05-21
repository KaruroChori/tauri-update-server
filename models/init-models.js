import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _archs from  "./archs.js";
import _channels from  "./channels.js";
import _events from  "./events.js";
import _licences from  "./licences.js";
import _releases from  "./releases.js";
import _subscriptions from  "./subscriptions.js";

export default function initModels(sequelize) {
  const archs = _archs.init(sequelize, DataTypes);
  const channels = _channels.init(sequelize, DataTypes);
  const events = _events.init(sequelize, DataTypes);
  const licences = _licences.init(sequelize, DataTypes);
  const releases = _releases.init(sequelize, DataTypes);
  const subscriptions = _subscriptions.init(sequelize, DataTypes);

  releases.belongsTo(archs, { as: "arch_arch", foreignKey: "arch"});
  archs.hasMany(releases, { as: "releases", foreignKey: "arch"});
  releases.belongsTo(channels, { as: "channel_channel", foreignKey: "channel"});
  channels.hasMany(releases, { as: "releases", foreignKey: "channel"});
  events.belongsTo(licences, { as: "licence_licence", foreignKey: "licence"});
  licences.hasMany(events, { as: "events", foreignKey: "licence"});
  subscriptions.belongsTo(licences, { as: "licence_licence", foreignKey: "licence"});
  licences.hasMany(subscriptions, { as: "subscriptions", foreignKey: "licence"});
  events.belongsTo(releases, { as: "release_release", foreignKey: "release"});
  releases.hasMany(events, { as: "events", foreignKey: "release"});

  //This is here until a new version of Sequelize will add a specific directive to prevent the automatic generation of a primary key.
  subscriptions.removeAttribute('id')

  return {
    archs,
    channels,
    events,
    licences,
    releases,
    subscriptions,
  };

}
