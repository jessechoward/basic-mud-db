module.exports = (sequelize, DataTypes) =>
{
	const identity = sequelize.define('identity',
	{
		id:
		{
			type: DataTypes.STRING,
			validate: {isUUID: 4}
		},
		email:
		{
			type: DataTypes.STRING,
			validate: {isEmail: true}
		}
	},
	{

	});

	return identity;
});