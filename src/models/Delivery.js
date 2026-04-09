//Entregas asociadas con una orden, solo pasan al elegirse despacho

const {DataTypes} = require("sequelize")
const sequelize = require("../config/database")

const Delivery = sequelize.define("Delivery",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    estado: {
        type: DataTypes.ENUM("preparando", "en_camino", "entregado", "fallido"),
        defaultValue: "preparando"
    },
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fechaEstimada: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "fecha_estimada"
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    //Clave foranea de la orden equivalente
    orderId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: "order_id",
        references: {model: "orders", key:"id"}
    } 
},{
    tableName: "deliveries",
    timestamps: true
})

module.exports = Delivery;