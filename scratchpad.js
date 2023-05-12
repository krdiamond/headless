const query = `
  query {
    productByHandle(handle: 'the-sky') {
        title
        id
        featuredImage {
          url
        }
      }
  }
`;



const headers = {
  'Content-Type': 'application/json',
  'Permissions-Policy': 'interest-cohort=()',
  'X-Shopify-Storefront-Access-Token': '5d5a8c181ff58af5e3473f6c439d9e4f',
};

axios.post('https://kd-email-test.myshopify.com/api/2023-01/graphql', { query }, { headers })
  .then(response => {
    console.log(response.data);
    productTitle.textContent = response.data.productByHandle.title;
  })
  .catch(error => {
    console.error(error);
  });


  <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>