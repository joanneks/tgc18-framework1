const cartDataLayer = require('../dal/carts');
const { createUserForm } = require('../forms');

async function addToCart(userId, productId, quantity){
    // 1. check if productID is already in user shopping cart
    const cartItem = await cartDataLayer.getCartItemByUserAndProduct(userId, productId)
    if(!cartItem){
        // 2. if not, create new item in shopping cart
        await cartDataLayer.createCartItem(userId, productId, quantity);
    } else {
        // 3. if yes, increase quantity in the cart item by 1
        await cartDataLayer.updateQuantity(userId, productId, cartItem.get('quantity') + 1);
    }
    // to indicate if the function was successful, 
    // e.g not enough stock, each user cannot buy more than 3
    return true;
}

async function getCart(userId){
    return cartDataLayer.getCart(userId);
}

async function updateQuantity(userId, productId, newQuantity){
    // to do here: check if the quantity matches the business rule
    // e.g each user can only purchase 2 of the same item
    return cartDataLayer.updateQuantity(userId, productId, newQuantity);
}

async function remove(userId, productId){
    return cartDataLayer.removeCartItem(userId, productId);
}


module.exports = { addToCart, getCart, updateQuantity, remove}