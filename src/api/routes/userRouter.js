import express from 'express'
import {users,sessions} from '@clerk/clerk-sdk-node';
import {authorizeMiddleware} from'../middlewares/authMiddleware.js'
const router = express.Router();
// router.use(authorizeMiddleware);
//get user

router.get('/:id', async (req, res) => {
  const user = await users.getUser(req.params.id)
  return res.json(user)
})


// create new user
router.post('/', async (req, res) => {
  const data = await req.body;
  const newUser = await users.createUser(data)
  return res.json(newUser)
})

//get all users
router.get('/', async (req, res) => {
  const data = await users.getUserList();
  if(!data){
    return res.json({error:'could not find data please check the server is running..'})
  }else{
    return res.json(data)
  }
})

router.get('/count', async (req, res) => {
  const data = await req.body
  res.json(data) // users count
})



//update user

// router.get('', async (req, res) => {
//   const updateUser = await Clerk.users.updateUser(req.param.id)
//   return res.json(updateUser)
// })


//delete user
router.delete('/:id', async (req, res) => {
  const data = await users.deleteUser(req.params.id)
  res.json(data)
})



export default router;