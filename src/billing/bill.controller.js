import Cart from '../cart/cart.model.js';
import Bill from './bill.model.js';
import User from '../user/user.js';
import jwt from 'jsonwebtoken';
import pdf from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Producto from '../product/product.model.js';

export const buyBill = async (req, res) => {
  try {
    const { nameU } = req.body;
    const user = await User.findOne({ nameU: nameU });

    if (!user) {
      res.status(404).json({ msg: 'User not found' });
    }

    const palabrita = process.env.SECRETORPRIVATEKEY;
    const xtoken = req.headers.token;
    const token = jwt.verify(xtoken, palabrita);
    const userToken = token.uid;

    if (userToken !== user._id.toString()) {
      res.status(401).json({ msg: 'No Autorizado' });
    }


    const userId = user._id;
    let cartCreate = await Cart.find({ user: userId, status: 'EXISTS' });

    

    if (cartCreate.length === 0) {
      res.status(400).json({ msg: 'No hay factura para generar' });
    }

    const billArray = [];
    var Payment = 0;


    

    for (const carts of cartCreate) {
      console.log({"carts":carts});
      Payment = 0;
      const _producto = await Producto.findById(carts.product);
      if (!_producto) {
        res.status(400).json({ msg: 'Producto no encontrado' });
      }

      console.log({"PRODUCTO":_producto});

      if (parseInt(carts.howMany) > parseInt(_producto.stock)) {

        

        return res
          .status(400)
          .send({ message: `Stock insfuciente para el producto: ${_producto.nameProduct}` });
      }
      const totalProduct = parseInt(carts.howMany) * parseInt(_producto.price);

      const bill = new Bill({
        emissionDate: new Date(),
        cartData: carts._id,
        totalPrice: totalProduct,
      });
      await bill.save();

      
      _producto.stock = parseInt(_producto.stock) - parseInt(carts.howMany);
      await _producto.save();

      carts.status = 'PAID';
      await carts.save();

      billArray.push(bill);
      Payment = Payment + parseInt(totalProduct);
    }
    const checkFolder = './checksBill';

    if (!fs.existsSync(checkFolder)) {
      fs.mkdirSync(checkFolder);
    }

    const checkInvoice = './checks';
    if (!fs.existsSync(checkInvoice)) {
      fs.mkdirSync(checkInvoice);
    }
    const checkPath = path.resolve(checkInvoice, `bills_${user.name}.pdf`);
    const check = new pdf();
    check.pipe(fs.createWriteStream(checkPath));

    check
      .font('Helvetica')
      .fontSize(25)
      .text('Facturación de Producto', { align: 'left' })
      .moveDown();

    for (const billGen of billArray) {
      

      const cart = await Cart.findById(billGen.cartData).populate('product');

      console.log({"cart":cart});

      const total = billGen.totalPrice;

      check.moveTo(50, check.y).lineTo(550, check.y).stroke();
      check.moveDown();
      check
        .fontSize(16)
        .text(`Fecha: ${billGen.emissionDate.toLocaleDateString()}`)
        .moveDown();
      check.fontSize(20).text(`ID Del carrito: ${cart._id}`).moveDown();
      check.moveTo(50, check.y).lineTo(550, check.y).stroke();
      check.moveDown();
      check.fontSize(20).text('Productos:');
      check.moveDown();
      const producto = await Producto.findById(cart.product);
      check.fontSize(12).text(`- ${producto.nameProduct}`);
      check.moveDown();
      check.fontSize(12).text(`(Cantidad: ${parseInt(cart.howMany)}`);
      check.moveDown();
      check.fontSize(12).text(`Precio: Q.${parseInt(producto.price)})`);
      check.moveDown();
      check.moveDown();
      check.moveTo(50, check.y).lineTo(550, check.y).stroke();
      check.moveDown();
      check.fontSize(20).text(`Total producto: Q.${total}`).moveDown();

      check.moveDown();
    }

    check.fontSize(16).text(`Total a pagar: Q.${Payment}`).moveDown();

    check.end();
    res.status(200).sendFile(checkPath);
  } catch (e) {
    console.log('Unexpected error: ', e);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
