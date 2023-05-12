const addToCartButton = document.getElementById('addToCart');
if (addToCartButton) {
    addToCartButton.addEventListener('click', function() {
        console.log('Button Clicked');
    });
} else {
    console.log('Element not found!');
}
