const router = require("express").Router();

const {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask
} = require('../controller/tasks');

router.route('/dashboard/tasks').post(createTask).get(getAllTasks)
router.route('/task/:id').get(getTask).patch(updateTask).delete(deleteTask)

module.exports = router;