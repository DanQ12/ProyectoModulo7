//Crud de categorias y productos
const {Category, Product} = require("../models")
const {Op} = require("sequelize")

//Lista de categorias con sus productos
async function getAll(req, res, next){
    try{
        //busceda dinamica por nombre
        const {search} = req.query;
        const where = {};
        if(search){
            where.nombre = { [Op.iLike]: `%${search}%` } //no afectada por mayusculas-minuscula
        }

        const categories = await Category.findAll({
            where,
            include: [{
                model: Product,
                as: "products",
                attributes: ["id", "nombre", "precio", "stock"]
            }],
            order: [["nombre", "ASC"]]
        })

        res.json({
            status: "success",
            message: `${categories.length} categorías encotnradas`,
            data: categories
        })
    }catch(err){
        next/(err)
    }
}

//Devolver una sola categoria con su productos
async function getById(req,res,next){
    try{
        const category = await Category.findByPk(req.params.id, {
            include:[{model: Product, as: "products"}]
        })

        if(!category){
            return res.status(404).json({
                status: "error",
                message: "Categoria no encontrada",
                data: null
            })
        }

        res.json({
            status: "success",
            message: "Categoria encontrada",
            data: category
        })
    }catch(err){
        next(err)
    }
}

module.exports = {getAll, getById}