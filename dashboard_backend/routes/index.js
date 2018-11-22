const 
  express              = require('express'),
  router               = express.Router(),
  jwt                  = require('jsonwebtoken'), 
  userController       = require('../api/users'),
  securitiesController = require('../securities')

// router.route('/users/gettoken').post( (req, res, next) => {
// 	console.log('get token')
//   userController.getToken(req, res, next)
// })

// router.post('/users/reset-password', (req, res) => {
//   userController.resetPassword(req, res)
// })

// const iterateBody = (body, stack) => {
//   for(var key in body) {
//     if(Object.prototype.toString.call(body[key]) == '[object String]') {  
//       // console.log(body[key])
//       body[key] = body[key].replace("'", " ")
//       // console.log(body[key])
//     }
//     else {
//       for(var key2 in body[key]) {
//         if(Object.prototype.toString.call(body[key][key2]) == '[object String]') {
//           // console.log(body[key][key2])
//           body[key][key2] = body[key][key2].replace("'", " ")
//           // console.log(body[key][key2])
//         }
//         else {
//           for(var key3 in body[key][key2]) {
//             if(Object.prototype.toString.call(body[key][key2][key3]) == '[object String]') {
//               // console.log(body[key][key2][key3])
//               body[key][key2][key3] = body[key][key2][key3].replace("'", " ")
//               // console.log(body[key][key2][key3])
//             }
//             else {
              
//             }
//           }
//         }
//       }
//     }
//   }
// }

// // Route middleware to verify a token
// router.use( (req, res, next) => {
//   console.log('token control')
//   if(req.body) {
//     iterateBody(req.body, '')
//   }

//   // check header or url parameters or post parameters for token
//   var token = req.body.token || req.query.token || req.headers['x-access-token']

//   // decode token
//   if (token) {
//     // verifies secret and checks exp
//     jwt.verify(token, config.secret, (err, decoded) => {
//       if (err) {
//         console.log(err)
//         return res.send(err)
//       } else {
//         req.currentUser = decoded._doc || decoded

        
//         // if everything is ok, save to request to use in other routes
//         if(req.currentUser){
//           next()
//         } else {
//           let error = "--token was valid, but something else failed--"
//           console.log(error)
//           return res.send(error)
//         }
//       }
//     })

//   } else {  
//     // if there is no token
//     // return an error
//     let error = "there is no auth token"
//     return res.send(error)

//   }
// })

router.get('/user', (req, res) => {
  userController.getUser(req, res)
})

router.post('/user', (req, res) => {
  userController.createUser(req, res)
})

router.put('/user', (req, res) => {
  userController.updateUser(req, res)
})

// SECURITIES

router.get('/securities', (req, res) => {
  securitiesController.getSecurities(req, res)
})