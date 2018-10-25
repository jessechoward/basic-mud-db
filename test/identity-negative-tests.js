require('dotenv').config();
const tape = require('tape');
const MudDb = require('../index');
const log = require('../logging');

const testIdentity = 'test@example.com';
const badIdentity = 'bad-email.com';
const testPass = 'neverUseMe';

const endTest = (db, assert, error=null) =>
{
	return db.close()
		.then(() =>
		{
			if (error) log(`Error: ${error}`);
			assert.end(error);
		});
};

tape('initialize database', (assert) =>
{
	const db = new MudDb({dialect: 'sqlite', storage: 'test.db'});
	db.sync(
	{
		force: true
	})
	.then(() =>
	{
		return db.models.identity.create(
		{
			email: badIdentity,
			password: testPass
		})
		.then((identity) =>
		{
			assert.fail('Identity should not be validated');
			return endTest(db, assert, 'Failed to invalidate the bad email');
		})
		.catch((error) =>
		{
			return endTest(db, assert, error);
		});
	})
	.catch((error) =>
	{
		assert.ok(error.errors, 'Sequelize threw a validation error on bad email address');
		return endTest(db, assert, error);
	});
});

tape.onFinish(() =>
{
	process.exit();
});
