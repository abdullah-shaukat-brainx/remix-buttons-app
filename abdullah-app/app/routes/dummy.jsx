import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    const { shop, accessToken } = session;
    const apiVersion = "2024-04";

    const response = await fetch(
      `https://${shop}/admin/api/${apiVersion}/products.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      const { products } = data;
      return json(products);
    }

    return json({});
  } catch (err) {
    console.log(err);
  }
};

export default function Products() {
  const products = useLoaderData();

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}
