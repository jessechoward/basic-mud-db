module.exports = (sequelize, DataTypes) =>
{
	const Player = sequelize.define('player',
	{
		id:
		{
			type: DataTypes.STRING,
			validate: {isUUID: 4},
			primaryKey: true
		},
		identityId:
		{
			type: DataTypes.STRING,
			allowNull: false
		},
		document:
		{
			type: DataTypes.STRING(10240),
			allowNull: false
		}
	},
	{
		timeStamps: true
	});

	Player.associate = (db) =>
	{
		// associations
	};

	return Player;
};
