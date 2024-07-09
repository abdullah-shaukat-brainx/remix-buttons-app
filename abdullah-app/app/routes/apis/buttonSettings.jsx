import { json } from "@remix-run/node";
import prisma from "../../db.server";
import { authenticate } from "../../shopify.server";
// import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  try {
    const { cors } = await authenticate.admin(request);
    const { session } = await authenticate.admin(request);
    const { shop } = session;
    const shopId = `shopify-${shop}`;

    const button = await prisma.shareButton.findUnique({
      where: { id: shopId },
    });

    return new Response(
      JSON.stringify({
        button: button,
        message: "Button details retrieved successfully.",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ message: "Failed to fetch button details" }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
};

// export const getButtonData = async () => {
//   const data = await useLoaderData();
//   return data;
// };
