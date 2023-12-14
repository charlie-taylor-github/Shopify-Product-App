async function makeQuery(graphql, query, variables = {}) {
  const response = await graphql(query, variables);
  const responseJson = await response.json();
  return responseJson.data;
}

export async function getShopName(graphql) {
  const { shop: { name } } = await makeQuery(
    graphql,
    `
        #graphql
        {
          shop {
            name
          }
        }
        `
  );
  return name;
}

export async function getProducts(graphql, startIndex, endIndex) {
  let afterArg = "";
  if (startIndex > 0) {
    const {
      products: { pageInfo: { endCursor: startCursor } }
    } = await makeQuery(graphql, `
    query getCursor {
      products(first: ${startIndex}) {
        pageInfo {
          endCursor
        }
      }
    }
    `);
    afterArg = `, after: "${startCursor}"`
  }

  let {
    products: { edges: products, pageInfo: { hasNextPage } }
  } = await makeQuery(graphql, `
    query getNextProduct {
        products(first: ${endIndex - startIndex}${afterArg}) {
          edges {
            node {
              title
              description
            }
            cursor
          },
          pageInfo {
            hasNextPage
          }
        }
    }
    `);
  return [products.map(p => p.node), hasNextPage];
}

export async function createProduct(graphql, title, description = "") {
  const response = await makeQuery(graphql, `
  mutation {
    productCreate(input: {
      title:"${title}"
      descriptionHtml:"${description}"
    }) {
      product {
        id 
        title
      }
    }
  }
  `);

  return { id: response?.productCreate?.product?.id };
}