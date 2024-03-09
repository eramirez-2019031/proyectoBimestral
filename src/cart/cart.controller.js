import User from '../user/user.js';
import Cart from './cart.model.js';
import Product from '../product/product.model.js';
import jwt from 'jsonwebtoken';

export const cartDataSave = async (req, res) => {
  try {
    const { Date, user, product, howMany } = req.body;
    const secretWord = process.env.SECRETORPRIVATEKEY;
    const xtoken = req.headers['x-token'];
    const token = jwt.verify(xtoken, secretWord);
    const userToken = token.uid;

    if (userToken !== user) {
      res
        .status(401)
        .json({ message: 'Verifique sus credenciales' });
    }

    const userFound = await User.findById(user);

    if (!userFound) {
      res.status(400).json({ message: 'User not found' });
    }

    let productFound = await Product.findOne({ nameProduct: product });
    if (!productFound) {
      res.status(400).json({ message: 'No se encontro el Producto' });
    }

    if (parseInt(productFound.stock) === 0) {
      res.status(400).json({
        message: 'Se acabo el stock de este producto',
      });
    }

    var cartFound = await Cart.findOne({
      user: user,
      product: productFound,
      status: 'EXISTS',
    });

    if (parseInt(howMany) <= 0) {
      res.status(400).json({
        message: 'No puede llevar una cantidad de prodcutos',
      });
    }
    if (parseInt(howMany) >= parseInt(productFound.stock)) {
      res.status(400).json({
        message: 'El número de productos solicitados es mayor que el stock.',
      });
    }
    if (cartFound) {
      cartFound.howMany = parseInt(cartFound.howMany);
      if (
        parseInt(cartFound.howMany) + parseInt(howMany) >
        parseInt(productFound.stock)
      ) {
        res.status(400).json({
          message: `Has alcanzado el stock máximo de ${productFound.stock} productos`,
        });
      } else {
        cartFound.howMany = parseInt(cartFound.howMany) + parseInt(howMany);
      }
    } else {
      cartFound = new Cart({
        Date: Date,
        user: user,
        product: productFound,
        howMany: howMany,
        status: 'EXISTS',
      });
    }
    await cartFound.save();
    res.status(200).json({ message: 'Carrito creado exitosamente', cartFound });
  } catch (e) {
    console.log('Error inesperado: ', e);
  }
};

export const cartDataDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const secretWord = process.env.SECRETORPRIVATEKEY;
    const xtoken = req.headers['x-token'];
    const token = jwt.verify(xtoken, secretWord);
    const userToken = token.uid;

    var cartFound = await Cart.findById({ _id: id });

    if (!cartFound) {
      res.status(400).json({
        message: 'No se encontró el carrito asociado con ese ID, inténtalo de nuevo',
      });
    }

    if (userToken !== cartFound.user.toString()) {
      res
        .status(401)
        .json({ msg: 'Ocurrió un error. Verificar todas las credenciales' });
    }

    if (cartFound.status === 'PAID') {
      res.status(400).json({ msg: 'Carrito ya pagado, no puedes eliminarlo' });
    }

    const cartGone = await Cart.findByIdAndDelete({ _id: id });

    if (cartGone.deletedCount === 0 || !cartGone) {
      res.status(400).json({
        msg: 'No se encontró el carrito asociado con ese ID; no se puede realizar la eliminación',
      });
    }

    res.status(200).json({ msg: 'Carrito eliminado exitosamente', cartGone });
  } catch (e) {
    console.log('error inesperado: ', e);
    res
      .status(500)
      .json({ message: 'Se produjo un error al intentar eliminar el carrito.' });
  }
};
