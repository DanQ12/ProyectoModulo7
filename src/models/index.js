const sequelize = require("../config/database");
const Category = require("./Category")
const Delivery = require("./Delivery")
const Order = require("./Order")
const OrderItem = require("./OrderItem")
const Product = require("./Product")
const User = require("./User")

//Relacion uno a muchos, un usario puede tener vario pedidos
User.hasMany(Order,{foreignKey:"userId", as:"orders"})
Order.belongsTo(User,{foreignKey:"userId", as:"user"})

//Relacion uno a muchos, una categoria puede tener varios productos
Category.hasMany(Product,{foreignKey:"categoryId", as:"products"})
Product.belongsTo(Category,{foreignKey:"categoryId", as:"category"})

//Relacion Muachos a Muchos, varios productos pueden aparecer en varias ordenes
/* Product.belongsToMany(Order,{through: OrderItem})
Order.belongsToMany(Product,{through: OrderItem}) */

Order.hasMany(OrderItem, {foreignKey: "orderId", as: "items"})
OrderItem.belongsTo(Order,{foreignKey:"orderId", as:"order"})

OrderItem.belongsTo(Product,{foreignKey:"productId", as: "product"})
Product.hasMany(OrderItem, {foreignKey:"productId", as: "orderItems"})

//Relacion 1 a 1, cada oreden tiene solo 1 entrega{
Order.hasOne(Delivery,{foreignKey:"orderId", as:"delivery"})
Delivery.belongsTo(Order,{foreignKey:"orderId", as:"order"})

module.exports = {sequelize ,User, Category, Delivery, Order,OrderItem,Product}