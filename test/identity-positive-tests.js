require('dotenv').config();
const tape = require('tape');
const MudDb = require('../index');
const log = require('../logging');

const testIdentity = 'test@example.com';
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
			email: testIdentity,
			password: testPass
		})
		.then((identity) =>
		{
			const values = identity.dataValues;
			assert.ok(values.id, 'New identity was created');
			assert.equals(values.enabled, true, 'Identity defaults to enabled');
			assert.equals(values.locked, null, 'Identity defaults to null locked');
			assert.equals(values.forceChange, false, 'Identity defaults to not force password change');
			db.models.identity.login(testIdentity, testPass)
				.then((result) =>
				{
					assert.notOk(result.password, 'Verified Identity does not return password or hash');
					const keys = Object.keys(result);
					for (const key of ['id', 'enabled', 'locked', 'forceChange', 'createdAt', 'updatedAt', 'authenticated'])
					{
						assert.ok(keys.includes(key), `Verified Identity has property ${key}`);
					}
					assert.ok(result.authenticated, 'Password authenticated');
					return endTest(db, assert);
				});
		})
		.catch((error) =>
		{
			return endTest(db, assert, error);
		});
	})
	.catch((error) =>
	{
		return endTest(db, assert, error);
	});
});

tape.onFinish(() =>
{
	process.exit();
});
