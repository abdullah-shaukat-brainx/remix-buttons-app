import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
// import { PrismaClient } from "@prisma/client";
import { useState } from "react";
import { authenticate } from "../shopify.server";

import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  return json({ shop });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();
  const enable = formData.get("enable") === "true";

  await prisma.button.upsert({
    where: { id: shop },
    update: { enable },
    create: { id: shop, enable },
  });

  return {};
};

export default function ButtonPage() {
  const { shopId } = useLoaderData();
  const [isEnabled, setIsEnabled] = useState(true);

  const handleEnableChange = (e) => {
    setIsEnabled(e.target.value === "true");
  };

  return (
    <div>
      <h1>Share Button</h1>
      <p>Shop ID: {shopId}</p>
      <Form method="post">
        <label>
          Enable/Disable Share Button:
          <select
            name="enable"
            value={isEnabled.toString()}
            onChange={handleEnableChange}
          >
            <option value="true">Enable</option>
            <option value="false">Disable</option>
          </select>
        </label>
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
