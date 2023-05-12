const addToCartButton = document.getElementById('addToCart');
const viewCartButton = document.getElementById('viewCart');



const productTitle = document.getElementById('productTitle');
const storeUserID = document.getElementById('storeUserID');
const storeVariantID = document.getElementById('storeVariantID');
const productImage = document.getElementById('productImage');

if (addToCartButton) {
    addToCartButton.addEventListener('click', function() {
        addToCart();
    });
}

if (viewCartButton) {
    viewCartButton.addEventListener('click', function() {
        viewCart();
    });
}


const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': '5d5a8c181ff58af5e3473f6c439d9e4f'
};

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

  // ---------------------------------------------- CREATE CART ---------------------------------------------- //

  const createCart = `
    mutation createCart {
        checkoutCreate(input: {}) {
        checkout {
            id
        }
        }
    }`;

  axios.post('https://kd-email-test.myshopify.com/api/2023-04/graphql', { query:createCart }, { headers })
  .then(response => {
    console.log('checkoutID');
    console.log(response.data);
    storeUserID.setAttribute('user-id', response.data.data.checkoutCreate.checkout.id);
  })
  .catch(error => {
    console.error(error);
  });

  // ---------------------------------------------- VIEW CART ---------------------------------------------- //

  const viewCart = () => {
    const userIDAttribute = storeUserID.getAttribute("user-id");
    // const splitUserIDAttribute = userIDAttribute.split('/')
    // const cartIDElement = splitUserIDAttribute[splitUserIDAttribute.length -1 ];
    // const cartID = "gid://shopify/Cart/" + cartIDElement
    // console.log(cartID);

    const viewCart = `
    query viewCart {
        node(id: "${userIDAttribute}") {
    ... on Checkout {
      id
      lineItems(first: 10) {
        edges {
          node {
            id
            title
            quantity
            variant {
              id
              title
            }
          }
        }
      }
    }
  }
      }`;

    axios.post('https://kd-email-test.myshopify.com/api/2023-04/graphql', { query:viewCart }, { headers })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });


  }
  

  





// ---------------------------------------------- ADD ITEM TO CART ---------------------------------------------- //

const addToCart = () => {
    const userIDAttribute = storeUserID.getAttribute("user-id");
    const variantIDAttribute = storeVariantID.getAttribute("variant-id");

    const addItemToCart = `
    mutation {
        checkoutLineItemsAdd(
        lineItems: [
            {
            variantId: "${variantIDAttribute}",
            quantity: 1
            }
        ],
        checkoutId: "${userIDAttribute}"
        ) {
            checkout {
                id
                lineItems(first: 10) {
                  edges {
                    node {
                      title
                    }
                  }
                }
              }
        }
    }`;

    axios.post('https://kd-email-test.myshopify.com/api/2023-04/graphql', { query:addItemToCart }, { headers })
    .then(response => {
        console.log('Item Added To Cart');
        console.log(response.data);

    })
    .catch(error => {
        console.error(error);
    });
  }


