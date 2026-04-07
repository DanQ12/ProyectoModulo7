//Modelo de las Categorias en las que se agrupoan lo diferentes productos

const {DataTypes} = require("sequelize")
const sequelize = require("../config/database")

const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
            notEmpty: {msg: "El nombre de la categoria esta vacio."}
        }
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull: true
    }
},{
    tableName: "categorias",
    timestamps: true
})

module.exports = Category