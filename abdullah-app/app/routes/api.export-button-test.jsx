import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const button = await prisma.button.findUnique({
    where: { id: shop },
  });
  const platforms = await prisma.platform.findMany();
  return json({ platforms, button, shop });
};
