const usrqry = require('../providers/users')
const sql_helper = require('../mssql_helper')

exports.checkMail = async function(mail, callback) {
	try {
		const connection = await sql_helper.getConnection();
		const query = `SELECT COUNT(*) AS MailExists FROM Users WHERE Mail = '${mail}'`;
		const result = await connection.request().query(query);
		connection.close();
		if(result.recordset.length > 0) {
			var mailExists = false;
			var exists = result.recordset[0].MailExists;
			if(exists > 0)
				mailExists = true;
			callback(null, mailExists);
		}
	}
	catch (err) {
		callback(err, null);
	}
}

exports.getUserById = async (id, getPassword, callback) => {
  try {
    const connection = await sql_helper.getConnection(),
      query = `SELECT * FROM Users WHERE Id = ${id}`,
      result = await connection.request().query(query)
    if(!getPassword) user.Password = undefined
    connection.close()
    callback(null, user)
  }
  catch (err) {
		callback(err, null);
	}
  
}

exports.createUser = async function(params, callback) {
  let query = 
`INSERT INTO  Users (
                      FirstName, 
                      LastName, 
                      Mail, 
                      Password, 
                      Fund
                    )
              VALUES (
                '${params.FirstName}',
                '${params.LastName}',
                '${params.Mail}',
                '${params.Password}',
                '${params.Fund}'
              )`;
  
  query = sql_helper.getLastIdentityQuery(query,'Users');

  sql_helper.createTransaction(query, function(err, result) {
    if(err) {
      console.log(err);
      return callback(err);
    }
    callback(null, result);
  });
}

exports.updateUser = async function(params, callback) {
	var query = 'DECLARE @UserID numeric(38,0)'

	query += ` UPDATE Users set `;
	if(params.FirstName)
		query += ` FirstName = '${params.FirstName}',`;
	if(params.LastName)
		query += `	LastName = '${params.LastName}',`;
	if(params.Mail)
		query += ` Mail = '${params.Mail}',`;
	if(params.RoleId)
		query += ` FUND = '${params.FUND}',`;
	if(params.IsEnabled)
		query += ` IsEnabled = '${params.IsEnabled}',`;
	if(params.Password)
		query += ` Password = '${params.Password}',`;

	query = query.slice(0, -1);

	query += ` where Id = '${params.Id}'`;


	sql_helper.createTransaction(query, function(err, result) {
		if(err) {
			console.log(err);
			return callback(err);
		}
		callback(null, result);
	});
}