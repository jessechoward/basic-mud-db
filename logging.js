let logger = (...args) => {};


if (['development', 'dev'].includes(process.env.NODE_ENV))
{
	logger = (...args) =>
	{
		args[0] = `[db.verbose] ${args[0]}`;
		console.log(...args);
	};
}

module.exports = logger;
