//Registro de cada compra hecha
const {DataTypes} = require("sequelize")
const sequelize = require("../config/database")

const Order = sequelize.define("Order", {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    total:{
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    },
    estado: {
        type: DataTypes.ENUM("pendiente", "confirmado", "en_preparacion", "enviado", "entregado", "cancelado"),
        defaultValue: "pendiente"
    },
    tipoEntrega:{
        type: DataTypes.ENUM("retiro", "depacho"),
        allowNull: false,
        field: "tipo_entrega"
    },
    direccionEntrega:{
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "direccion_entrega"
    },
    //Clave foranea para relacionar con el cliente
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        references: {model: "users", key:"id"}
    }
},{
    tableName: "orders",
    timestamps: true
})

module.exports = Order