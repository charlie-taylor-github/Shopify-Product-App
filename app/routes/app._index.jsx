// @ts-nocheck
import { useEffect, useState } from "react";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import { Frame, Page, Layout, FrameContext } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import CreateProductForm from "~/components/CreateProductForm";
import ProductTable from "~/components/ProductTable";
import { getProducts, getShopName, createProduct } from "~/models/database";

const productTableRows = 10;

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const graphql = admin.graphql;
  const shopName = await getShopName(graphql);
  const [products, hasNextPage] = await getProducts(graphql, 0, productTableRows * 2);
  return json({ name: shopName, products, hasMoreProducts: hasNextPage });
};

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const data = await request.formData();
  const action = await data.get("action");
  const paramsString = await data.get("params");
  const params = JSON.parse(paramsString);

  const state = { newProducts: [] }

  if (action === "update-product-table") {
    const [products, hasNextPage] = await getProducts(
      admin.graphql, params.startIndex, params.endIndex
    );
    state.products = products;
    state.hasMoreProducts = hasNextPage;
  } else if (action === "create-product") {
    const { title, description } = params;
    const { id } = await createProduct(admin.graphql, title, description);
    state.newProducts.push(id);
  }

  return json(state);
}

export default function Index() {
  const submit = useSubmit();

  const { name: shopName, products: initialProducts } = useLoaderData();
  const actionData = useActionData();

  const [products, setProducts] = useState(initialProducts);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [loadingCreateProduct, setLoadingCreateProduct] = useState(false);
  const [productToastActive, setProductToastActive] = useState(false);

  useEffect(() => {
    if (!actionData?.products) return;

    setProducts(p => p.concat(actionData.products));
    setProductsLoaded(!actionData.hasMoreProducts);

  }, [actionData?.products]);

  useEffect(() => {
    if (!actionData?.newProducts) return;

    setLoadingCreateProduct(false);
    // setProductToastActive(true);

  }, [actionData?.newProducts]);

  async function requestMoreProducts() {
    console.log("requesting more...")
    submit(
      {
        action: "update-product-table",
        params: JSON.stringify({
          startIndex: products.length,
          endIndex: products.length + productTableRows
        })
      },
      { method: "POST" });
  }

  async function requestCreateProduct(product) {
    setLoadingCreateProduct(true);
    submit(
      {
        action: "create-product",
        params: JSON.stringify(product)
      },
      { method: "POST" });
  }

  return (
    <Frame>
      <Page
        title={shopName}
        divider
      >
        <Layout>
          <CreateProductForm
            submit={requestCreateProduct}
            loading={loadingCreateProduct}
            toastActive={productToastActive}
            setToastActive={setProductToastActive}
          />
          <ProductTable
            rows={productTableRows}
            products={products}
            productsLoaded={productsLoaded}
            requestMoreProducts={requestMoreProducts}
          />
        </Layout>
      </Page>
    </Frame>
  );
}
