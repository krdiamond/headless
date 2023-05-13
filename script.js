const cartID = localStorage.getItem('cartID');
const checkOutID = localStorage.getItem('checkOutID');

const addToCartButton = document.getElementById('addToCart');

const productTitle = document.getElementById('productTitle');
const productImage = document.getElementById('productImage');
const checkOutLink = document.getElementById('checkOut');
const cartQty = document.getElementById('cartQty');

const storeVariantID = document.getElementById('storeVariantID');

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': '5d5a8c181ff58af5e3473f6c439d9e4f'
};

// ---------------------------------------------- VIEW CART ---------------------------------------------- //
const viewCart = () => {
    const viewCart = `
    query {
        cart(id: "${cartID}") {
            totalQuantity
        }
        node(id: "${checkOutID}") {
            ... on Checkout {
              id
              webUrl
            }
          }
      }`;

    axios.post('https://kd-email-test.myshopify.com/api/2023-04/graphql', { query:viewCart }, { headers })
    .then(response => {
        console.log("View Cart")
        console.log(response.data);
        console.log(response.data.data.node.webUrl);
        checkOutLink.setAttribute('href', response.data.data.node.webUrl); 
        cartQty.textContent =  response.data.data.cart.totalQuantity
    })
    .catch(error => {
        console.error(error);
    });
}

// ---------------------------------------------- CREATE CART ---------------------------------------------- //

const createCart = () => {
    const createCartData = `
    mutation {
        cartCreate(input: {}) {
            cart {
                id
                totalQuantity
            }
        }
        checkoutCreate(input: {}) {
            checkout {
                id
                webUrl
            }
        }
    }`;

    axios.post('https://kd-email-test.myshopify.com/api/2023-04/graphql', { query:createCartData }, { headers })
    .then(response => {
        console.log('Cart Data');
        console.log(response.data);
        localStorage.setItem('cartID', response.data.data.cartCreate.cart.id);
        localStorage.setItem('checkOutID', response.data.data.checkoutCreate.checkout.id);
        checkOutLink.setAttribute('href', response.data.data.checkoutCreate.checkout.webUrl); 
        cartQty.textContent =  response.data.data.cartCreate.cart.totalQuantity;    
    })
    .catch(error => {
        console.error(error);
    });
}
   


// ---------------------------------------------- GET PRODUCTS ---------------------------------------------- //
const getProducts = `
  query getProducts {
    productByHandle(handle: "the-sky") {
      title
      id
      featuredImage {
        url
      }
      variants(first: 5) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

axios.post('https://kd-email-test.myshopify.com/api/2023-04/graphql', { query:getProducts }, { headers })
  .then(response => {
    console.log('Product Data');
    console.log(response.data.data);
    productTitle.textContent = response.data.data.productByHandle.title;  
    productImage.setAttribute('src', response.data.data.productByHandle.featuredImage.url);
    storeVariantID.setAttribute('variant-id', response.data.data.productByHandle.variants.edges[0].node.id);
  })
  .catch(error => {
    console.error(error);
  });

// ---------------------------------------------- ADD ITEM TO CART ---------------------------------------------- //

const addToCart = () => {
    const cartID = localStorage.getItem('cartID');
    const checkOutID = localStorage.getItem('checkOutID');
    const variantIDAttribute = storeVariantID.getAttribute("variant-id");

    const addItemToCart = `
    mutation {
        checkoutLineItemsAdd(checkoutId: "${checkOutID}", lineItems: {quantity: 1, variantId: "${variantIDAttribute}"}) {
            checkout {
              webUrl
              id
            }
        }
        cartLinesAdd(cartId: "${cartID}", lines: {quantity: 1, merchandiseId: "${variantIDAttribute}"}) {
            cart {
              totalQuantity
            }
          }
    }`;

    axios.post('https://kd-email-test.myshopify.com/api/2023-04/graphql', { query:addItemToCart }, { headers })
    .then(response => {
        console.log('Item Added To Cart');
        console.log(response.data);
        cartQty.textContent =  response.data.data.cartLinesAdd.cart.totalQuantity; 
    })
    .catch(error => {
        console.error(error);
    });
  }
    

// ---------------------------------------------- INITIALIZE CART ---------------------------------------------- //

if (cartID) {
    viewCart();
}
else {
    createCart();
}

if (addToCartButton) {
    addToCartButton.addEventListener('click', function() {
        addToCart();
    });
}