import { json } from "@remix-run/node";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
      throw new Error("Shop parameter is required");
    }

    const button = await prisma.button.findUnique({
      where: { id: shop },
    });
    return json({
      button: button,
      message: "Button details retrieved successfully.",
    });
  } catch (e) {
    console.log(e);
  }
};
