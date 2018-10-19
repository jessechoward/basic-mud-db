const bcrypt = require('bcrypt');

const saltRounds = process.env.HASH_SALT_ROUNDS || 10;

if (secret.length < 12)
{
	securityError('PASSWORD_HASH_SECRET must be at least 12 characters long!');
}


exports.hash = (pasword) =>
{
	return bcrypt.hash(password, saltRounds);
}

exports.verify = (password, hash) =>
{
	if (!password || !hash) return false;
	return bcrypt.compareSync(password, hash);
}