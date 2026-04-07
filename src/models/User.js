//Modelo de usuario, representando clientes y administradores de le tienda
const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
        type: DataTypes.STRING(100),
        allowNull:false,
        validate: {
            notEmpty: {msg: "El nombre no puede estar vacio."},
            len: {arg: [2,100], msg:"El nombre debe tener entre 2 y 100 caracteres."}
        }
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: {msg: "Este email ya esta registrado."},
        validate:{
            isEmail: {msg: "Debe ingresar un email válido."}
        }
    },
    password:{
        type: DataTypes.STRING(255),
        allowNull: false
    },
    telefono:{
        type: DataTypes.STRING(20),
        allowNull: true
    },
    rol:{
        type: DataTypes.ENUM("admin", "cliente"),
        defaultValue: "cliente"
    },
    avatar:{
        type: DataTypes.STRING(255),
        allowNull: true
    }
},{
    tableName: "users",
    timestamps: true
})

module.exports = User;