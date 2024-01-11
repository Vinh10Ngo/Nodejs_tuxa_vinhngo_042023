var express = require('express');
var router = express.Router();
var asyncHandler = require('../middleware/async');
var errorResponse   = require('../utils/ErrorResponse')
var { protect, authorize } = require('../middleware/auth');

const controllerName = 'careers'
const MainModel = require(__path_models + controllerName)
const MainValidate	= require(__path_validates + controllerName);

router.get('/', asyncHandler( async (req, res, next) => {
    const data = await MainModel.listItems(req.query, {task: 'all'})
    if(!data) return res.status(200).json({success : true,data : "Dữ liệu rỗng"})
    res.status(201).json({
        success: true,
        count: data.length,
        data: data,
    })
}))
router.get('/:id', asyncHandler (async (req, res, next) => {
    const data = await MainModel.listItems({id: req.params.id}, {task: 'one'})
    if(!data) return res.status(200).json({success : true,data : "Dữ liệu rỗng"})
    res.status(201).json({
        success: true,
        data: data
    })  
}))
router.post('/add', protect, authorize('admin', 'publisher'), asyncHandler (async (req, res, next) => {
    let err = await validateReq(req, res, next)
    if(!err){
        const data = await MainModel.createItem(req.body);
        res.status(201).json({
            success : true,
            data : data
        })
    }
}))
router.delete('/delete/:id', protect, authorize('admin', 'publisher'), asyncHandler (async (req, res, next) => {
    const data = await MainModel.deleteItem({id: req.params.id}, {task: 'one'})
    res.status(201).json({
        success: true,
        data: data
    })  
}))
router.put('/edit/:id', protect, authorize('admin', 'publisher'), asyncHandler(async (req, res, next) => {
    let err = await validateReq(req,res, next);
    if(!err){
        console.log(req.body);
        const data = await MainModel.editItem({'id' : req.params.id,'body' : req.body} , {'task' : 'edit'})
        res.status(200).json({
            success : true,
            data : data
        })
    }
}))
router.put('/:type/:id', asyncHandler(async (req, res, next) => {
    const data = await MainModel.event({'id' : req.params.id, 'type' : req.params.type})
    if(!data) return res.status(200).json({success : true,data : "Sai trạng thái cập nhật"})
    console.log(data);
    res.status(200).json({
        success : true,
        data : data
    })
}))
const validateReq = async (req, res, next) => {
    let err = await MainValidate.validator(req)
    if(Object.keys(err).length > 0) {
        next(new errorResponse(400, err));
        return true
    }
    return false
}

module.exports = router;

