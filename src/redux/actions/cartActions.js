function addProduct(quantity, id) {
    return {
        type: "ADD_PRODUCT",
        payload: { quantity, id}
    }
}

function removeProduct(id) {
    return {
        type: "REMOVE_PRODUCT",
        payload: { id}
    }
}

function clearCart() {
    return {
        type: "CLEAR_PRODUCTS",
    }
}

function getCart() {
    return {
        type: "LIST_PRODUCTS",
    }
}

export { addProduct, removeProduct, clearCart, getCart }