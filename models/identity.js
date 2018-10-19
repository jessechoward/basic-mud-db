const security = require('../security');

module.exports = (sequelize, DataTypes) =>
{
	const Identity = sequelize.define('identity',
	{
		id:
		{
			type: DataTypes.STRING,
			validate: {isUUID: 4},
			primaryKey: true
		},
		email:
		{
			type: DataTypes.STRING,
			validate: {isEmail: true},
			unique: true,
			allowNull: false
		},
		password:
		{
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		forceChange:
		{
			type: DataTypes.BOOLEAN,
			default: false
		},
		enabled:
		{
			type: DataTypes.BOOLEAN,
			default: true,
			allowNull: false
		},
		locked:
		{
			type: DataTypes.STRING,
			allowNull: true,
			default: null
		}
	},
	{
		timeStamps: true,
		freezeTableName: true,
		hooks:
		{
			beforeCreate: (identity, options) =>
			{
				return security.hashPassword(identity.password)
					.then((hash) => {identity.password = hash;});
			}
		}
	});

	Identity.prototype.verify = function (password)
	{
		if (!password) return false;
		return security.verifyPassword(password, this.password);
	}

	Identity.login = (email, password) =>
	{
		return Identity.findOne(
		{
			where:
			{
				email: email
			}
		})
		.then((identity) =>
		{
			if (identity)
			{
				return {
					id: identity.id,
					email: identity.email,
					enabled: identity.enabled,
					locked: identity.locked,
					authenticated: (identity.enabled && !identity.locked && identity.verify(password))
				};
			}
			else
			{
				return {error: 'not found'};
			}			
		});
	};

	Identity.associate = (db) =>
	{
		// set identityId on Player instances to the owning Identity
		// adds getPlayers and setPlayers to Identity instances
		Identity.hasMany(db.Player, {as: 'Players', foreignKey: 'identityId', });
	};

	return identity;
};