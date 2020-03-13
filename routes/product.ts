import fs from 'fs';
import path from 'path';
import { Router, Request, Response } from "express";
import Category from "../model/Category";
import Product from "../model/Product";

const productRoutes = Router();

productRoutes.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: "Todo funciona bien"
    });
});


// ====================================
// Obtener Categorías
// ====================================
productRoutes.get('/category', (req: Request, res: Response) => {
    Category.find((err, categories) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al obtener categorías',
                    err
                }
            });
        }
        res.status(200).json({
            ok: true,
            categories
        });
    });
});

// ====================================
// Agregar Categoría
// ====================================
productRoutes.post('/category', (req: Request, res: Response) => {
    const body = req.body;
    if (
        !body.title
    ) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: "Faltan datos"
            }
        });
    }
    const category = new Category({
        title: body.title
    });
    category.save((err, catSaved) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                err: {
                    err,
                    messsage: 'Error al agregar categoría'
                }
            });
        }
        res.status(201).json({
            ok: true,
            category: catSaved
        });
    });

});

// ====================================
// Eliminar Categoría
// ====================================
productRoutes.delete('/category', (req: Request, res: Response) => {
    if (!req.body.id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Error no se envió id'
            }
        });
    }
    Category.findOneAndDelete(req.body.id, (err, catDel) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al obtener categorías',
                    err
                }
            });
        }
        if (!catDel) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            });
        }
        res.status(200).json({
            ok: true,
            catDel
        });
    });
});


// ====================================
// Agregar Producto
// ====================================
productRoutes.post('', (req: Request, res: Response) => {
    const body = req.body;
    if (!body.title ||
        !body.price ||
        !body.stock ||
        !body.category ||
        !body.description
    ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Error faltan datos por enviar'
            }
        });
    }
    // Buscar categoría
    Category.findById(body.category, (err, category) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al agregar producto'
                }
            });
        }
        if (!category) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error, la categoría no existe'
                }
            });
        }
        const product = new Product({
            title: body.title,
            img: body.img,
            price: body.price,
            stock: body.stock,
            description: body.description,
            category: body.category
        });
        product.save((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error al agregar producto'
                    }
                });
            }
            res.status(201).json({
                ok: true,
                product: productDB
            });
        });
    });
});


// ====================================
// Obtener Productos
// ====================================
productRoutes.get('', (req: Request, res: Response) => {
    Product.find()
        .populate('category')
        .exec(
            ((err, products) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Error al obtener productos',
                            err
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    products
                });
            })
        );

});


// ====================================
// Obtener Producto por id
// ====================================
productRoutes.get('/:id', (req: Request, res: Response) => {
    Product.findById(req.params.id)
        .populate('category')
        .exec(
            ((err, product) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Error al obtener productos',
                            err
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    product
                });
            })
        );
});




// ====================================
// Obtener Producto por categoria
// ====================================
productRoutes.get('/category/:idcat', (req: Request, res: Response) => {
    Product.find({ category: req.params.idcat })
        .populate('category')
        .exec(
            ((err, products) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Error al obtener productos',
                            err
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    products
                });
            })
        );
});


// ====================================
// Eliminar Producto
// ====================================
productRoutes.delete('/:id', (req: Request, res: Response) => {
    Product.findByIdAndDelete(req.params.id)
        .populate('category')
        .exec(
            ((err, productDeleted) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Error al eliminar producto',
                            err
                        }
                    });
                }
                if (!productDeleted) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Error, el producto no existe',
                            err
                        }
                    });
                }
                res.status(200).json({
                    ok: true,
                    product: productDeleted
                });
            })
        );
});


// ====================================
// Modificar Producto
// ====================================
productRoutes.put('/:id', (req: Request, res: Response) => {
    const body = req.body;
    const id = req.params.id;
    if (!body.title ||
        !body.price ||
        !body.stock ||
        !body.category ||
        !body.description
    ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Error faltan datos por enviar'
            }
        });
    }




    // Buscar categoría
    Category.findById(body.category, (err, category) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error al agregar producto'
                }
            });
        }
        if (!category) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error, la categoría no existe'
                }
            });
        }

        // Modificar Producto
        Product.findByIdAndUpdate(id, {
            title: body.title,
            price: body.price,
            stock: body.stock,
            category: body.category,
            description: body.description,
            active: body.active || true
        })
            .populate('category')
            .exec(
                ((err, productUpdated) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err: {
                                message: 'Error al eliminar producto',
                                err
                            }
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        product: productUpdated
                    });
                })
            );
    });
});




// ====================================
// Modificar Imagen Producto
// ====================================
productRoutes.put('/img/:id', (req: any, res: Response) => {
    if (!req.files.img) {
        return res.status(400).json({
            ok: false,
            err: 'No se envió la imágen'
        });
    }

    Product.findById(req.params.id)
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error al modificar imagen',
                        err
                    }
                });
            }
            if (!product) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El producto no existe',
                        err
                    }
                });
            }
            // Subir imagen del servidor
            const img = req.files.img;
            const splitted = img.name.split(".");
            const extension = splitted[splitted.length - 1];
            const imgPath = path.resolve(__dirname, '../img');
            if (!fs.existsSync(imgPath)) {
                fs.mkdirSync(imgPath);
            }
            img.mv(imgPath + `/${req.params.id}.${extension}`);

            Product.findByIdAndUpdate(req.params.id, {
                img: `${req.params.id}.${extension}`
            })
                .populate('category')
                .exec(
                    ((err, productUpdated) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                err: {
                                    message: 'Error al modificar imagen producto',
                                    err
                                }
                            });
                        }
                        res.status(200).json({
                            ok: true,
                            product: productUpdated
                        });
                    })
                );
        });
});

// =========================
//  Obtener imagen
// =========================
productRoutes.get('/img/:id', (req: Request, res: Response) => {
    const pathImage = path.resolve(__dirname, '..', 'img');
    // Getting all images in directory
    const files = fs.readdirSync(pathImage);
    const file = files.filter(file => file.startsWith(req.params.id))[0];
    if(!file) {
        return res.sendFile(pathImage + '/not-found.jpg');
    }
    res.sendFile(pathImage + '/' + file);
});

export default productRoutes;