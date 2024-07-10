import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";
import { Switch, FormControlLabel, Button } from "@mui/material";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const button = await prisma.button.findUnique({
    where: { id: shop },
  });
  return json({ button, shop });
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
  const { button, shop } = useLoaderData();
  const [isEnabled, setIsEnabled] = useState(button?.enable ?? true);

  const handleEnableChange = (e) => {
    setIsEnabled(e.target.checked);
  };

  return (
    <div>
      <h1>Share Button</h1>
      <p>Shop ID: {shop}</p>

      <Form method="post">
        <Switch
          checked={isEnabled}
          onChange={handleEnableChange}
          name="enable"
          color="primary"
          label="Enable/Disable Share Button"
        />
        <input type="hidden" name="enable" value={isEnabled.toString()} />
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Form>
    </div>
  );
}
