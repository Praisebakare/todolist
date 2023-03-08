const Task = require('../model/tasks')
const asyncWrapper = require('../middleware/async')
const {
  createCustomError
} = require('../errors/custom-error')


const createTask = asyncWrapper(async (req, res) => {
  let sess = req.session
  if (sess.token) {
    try {
      const name = req.body.name
      const user = sess.user

      try {
        const task = await Task.create({
          user,
          name
        })
        /* const task = await Task.create(req.body) */
        res.status(201).json({
          task
        })
      } catch (err) {
        console.log(err)
      }
    } catch (error) {
      console.log(error)
      return res.json({
        status: false,
        msg: "An error occurred"
      });
    }
  } else {
    return res.json({
      status: false,
      msg: "User not available"
    });
  }
})

const getAllTasks = asyncWrapper(async (req, res) => {
  let sess = req.session
  if (sess.token) {
    try {
      const user = sess.user
      const tasks = await Task.find({
        user
      }).lean()

      res.status(200).json({
        tasks
      })
    } catch (error) {
      console.log(error)
      return res.json({
        status: false,
        msg: "An error occurred"
      });
    }
  } else {
    return res.json({
      status: false,
      msg: "User not available"
    });
  }
})

const getTask = asyncWrapper(async (req, res, next) => {
  let sess = req.session
  if (sess.token) {
    try {
      const {
        id: taskID
      } = req.params
      const task = await Task.findOne({
        _id: taskID
      })
      if (!task) {
        return next(createCustomError(`No task with id : ${taskID}`, 404))
      }

      res.status(200).json({
        task
      })
    } catch (error) {
      console.log(error)
      return res.json({
        status: false,
        msg: "An error occurred"
      });
    }
  } else {
    return res.json({
      status: false,
      msg: "User not available"
    });
  }

})

const deleteTask = asyncWrapper(async (req, res, next) => {
  let sess = req.session
  if (sess.token) {
    try {
      const {
        id: taskID
      } = req.params
      const task = await Task.findOneAndDelete({
        _id: taskID
      })
      if (!task) {
        return next(createCustomError(`No task with id : ${taskID}`, 404))
      }
      res.status(200).json({
        task
      })
    } catch (error) {
      console.log(error)
      return res.json({
        status: false,
        msg: "An error occurred"
      });
    }
  } else {
    return res.json({
      status: false,
      msg: "User not available"
    });
  }

})

const updateTask = asyncWrapper(async (req, res, next) => {
  let sess = req.session
  if (sess.token) {
    try {
      const {
        id: taskID
      } = req.params

      const task = await Task.findOneAndUpdate({
        _id: taskID
      }, req.body, {
        new: true,
        runValidators: true,
      })

      if (!task) {
        return next(createCustomError(`No task with id : ${taskID}`, 404))
      }

      res.status(200).json({
        task
      })
    } catch (error) {
      console.log(error)
      return res.json({
        status: false,
        msg: "An error occurred"
      });
    }
  } else {
    return res.json({
      status: false,
      msg: "User not available"
    });
  }
})

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
}