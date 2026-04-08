    //Ruoter raiz que monta las subsrutas, permitiendo flexibilidad y exalamiento
    
    const Router = require("express");
    const authRoutes = require("./authRoutes")
    const categoryRoutes = require("./categoryRoutes")
    const orderRoutes = require("./orderRoutes")
    const productsRoutes = require("./productsRoutes")
    //const uploadsRoutes = require("./uploadsRoutes")
    const userRoutes = require("./userRoutes")

    const router = Router()

    //monaje de las rutas
    router.use("/auth", authRoutes)
    router.use("/categories", categoryRoutes)
    router.use("/orders", orderRoutes)
    router.use("/products", productsRoutes)
    //router.use("/uploads", uploadsRoutes)
    router.use("/users", userRoutes)
    
    module.exports = router;