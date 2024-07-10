import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  try {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    console.log("shop%%%: ", shop, " type: ", typeof shop);
    if (!shop) {
      throw new Error("Shop parameter is required");
    }

    const button = await prisma.button.findUnique({
      where: { id: shop },
    });
    console.log("before sending response");
    return json(
      {
        button: button,
        message: "Button details retrieved successfully.",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allowed methods
          "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
        },
      },
    );
  } catch (e) {
    console.log(e);
    return json(
      {
        error: e.message,
        message: "Failed to fetch button details",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allowed methods
          "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
        },
      },
    );
  }
};
