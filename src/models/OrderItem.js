//Modelo de cada item en una orden

const {DataTypes} = require("sequelize")
const sequelize = require("../config/database")

const OrderItem = sequelize.define("OrderItem",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            min: {args: [1], msg: "La cantidad minima es 1."}
        }
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        field: "precio_unitario"
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "order_id",
        references: {model: "orders", key: "id"}
    },
    productId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_id",
        references: {model: "products", key: "id"}
    }
},{
    tableName: "order_items",
    timestamps: true
})

module.exports = OrderItem;