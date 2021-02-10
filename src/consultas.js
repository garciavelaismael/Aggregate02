
// Muestra de mayor a menor las marcas más vendidas y el mes en el que se producieron.
db.moviles.aggregate([
    {
        $group:
        {
            _id:
            {
                month: { $month: "$sale.date" },
                year: { $year: "$sale.date" },
                brand: "$product.brand"
            }, 
            sales:
            {
                $addToSet: "$sale.units"
            },
        }
    },
    { $sort: { sales: -1 } }
])

/*
{ "_id" : { "month" : 12, "year" : 2019, "brand" : "Apple" }, "sales" : [ 30 ] }
{ "_id" : { "month" : 12, "year" : 2019, "brand" : "Samsung" }, "sales" : [ 15 ] }
{ "_id" : { "month" : 1, "year" : 2020, "brand" : "Oppo" }, "sales" : [ 4 ] }
{ "_id" : { "month" : 12, "year" : 2019, "brand" : "Redmi" }, "sales" : [ 3 ] }
{ "_id" : { "month" : 9, "year" : 2020, "brand" : "Realme" }, "sales" : [ 3 ] }
{ "_id" : { "month" : 6, "year" : 2020, "brand" : "Oneplus" }, "sales" : [ 3 ] }
{ "_id" : { "month" : 10, "year" : 2020, "brand" : "Realme" }, "sales" : [ 2 ] }
{ "_id" : { "month" : 9, "year" : 2020, "brand" : "Redmi" }, "sales" : [ 2 ] }
{ "_id" : { "month" : 9, "year" : 2019, "brand" : "Alcatel" }, "sales" : [ 1 ] }
{ "_id" : { "month" : 5, "year" : 2019, "brand" : "Realme" }, "sales" : [ 1 ] }
*/


// Muestra el año junto a la media de unidades vendidas en el año.
db.moviles.aggregate([
    {
        $match: {
            $or: [
                {
                    "sale.date":
                    {
                        $gte: new ISODate("2019-01-01")
                    }
                },
                {
                    "sale.date":
                    {
                        $lte: new ISODate("2020-12-31")
                    }
                }]
        }
    },
    { $group: { _id: { year: { $year: "$sale.date" } }, average: { $avg: "$sale.units" } } }
])

/*
{ "_id" : { "year" : 2019 }, "average" : 9 }
{ "_id" : { "year" : 2020 }, "average" : 5.75 }
*/


// Muestra el total ganado y el total con IVA.
db.moviles.aggregate(
    [
        {
            $match: {
                $expr: { $eq: [{ $year: "$sale.date" }, 2020] }
            }
        },
        {
            $group:
            {
                _id: { $year: "$sale.date" },
                total: { $sum: { $multiply: ["$sale.price", "$sale.units"] } }
            }
        },
        {
            $project: {
                año: "$_id",
                _id: 0,
                total: "$total",
                IVA: { $multiply: ["$total", 0.21] },
                totalIVA: { $multiply: ["$total", 1.21] },
            }
        },
    ]
)

/*
{ "año" : 2020, "total" : 3870, "IVA" : 812.6999999999999, "totalIVA" : 4682.7 }
*/


// Muestra las ventas totales de los meses de 2019
db.moviles.aggregate([
    {
        $match: {
            $expr: { $eq: [{ $year: "$sale.date" }, 2019] }
        }
    },
    {
        $group: {
            _id: {
                month: { $month: "$sale.date" },
                year: { $year: "$sale.date" }
            },
            salestotal: { $sum: { $multiply: ["$sale.price", "$sale.units"] } }
        }
    },
])

/*
{ "_id" : { "month" : 12, "year" : 2019 }, "salestotal" : 43515 }
{ "_id" : { "month" : 9, "year" : 2019 }, "salestotal" : 85 }
{ "_id" : { "month" : 5, "year" : 2019 }, "salestotal" : 115 }
*/

// Muestra el modelo más vendido dentro del status C.
db.moviles.aggregate([
    {
        $match: {
            "product.status": "C"
        }
    },
    {
        $group: {
            _id: "$product.model",
            best_product: {
                $max: "$sale.units"
            }
        }
    }
])

/*
{ "_id" : "Galaxy S20", "best_product" : 15 }
{ "_id" : "iPhone 12", "best_product" : 30 }
{ "_id" : "Nord", "best_product" : 3 }
*/


// Muestra a todos los clientes ordenados de más compras realizadas a menos.
db.moviles.aggregate([
    {
        $group: {
            _id: "$client.name",
            sales: {
                $max: "$sale.units"
            }
        }
    },
    { $sort: { sales: -1 } }
])

/*
{ "_id" : "Alejandro", "sales" : 30 }
{ "_id" : "Carlos", "sales" : 15 }
{ "_id" : "Fran", "sales" : 4 }
{ "_id" : "Ignacio", "sales" : 3 }
{ "_id" : "Pedro", "sales" : 3 }
{ "_id" : "Ana", "sales" : 3 }
{ "_id" : "Guillermo", "sales" : 2 }
{ "_id" : "Victor", "sales" : 2 }
{ "_id" : "David", "sales" : 1 }
{ "_id" : "Manuel", "sales" : 1 }
*/


// Beneficios totales de cada compañía.
db.moviles.aggregate([
    {
        $group: {
            _id: "$product.brand",
            total:
            {
                $sum:
                {
                    $multiply:
                        ["$sale.price", "$sale.units"]
                }
            }
        }
    },
])

/*
{ "_id" : "Oneplus", "total" : 1020 }
{ "_id" : "Oppo", "total" : 1440 }
{ "_id" : "Redmi", "total" : 905 }
{ "_id" : "Alcatel", "total" : 85 }
{ "_id" : "Apple", "total" : 31800 }
{ "_id" : "Realme", "total" : 1085 }
{ "_id" : "Samsung", "total" : 11250 }
*/


