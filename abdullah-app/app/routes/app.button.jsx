import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { BlockStack, RadioButton, RangeSlider, Select } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useState, useCallback } from "react";

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
  const radius = Number(formData.get("radius"));
  const variant = formData.get("variant");
  const size = formData.get("size");

  if (enable == null || isNaN(radius) || !variant || !size) {
    return json({ error: "Cannot accept a missing field" }, { status: 400 });
  }

  await prisma.button.upsert({
    where: { id: shop },
    update: { enable, radius, variant, size },
    create: { id: shop, enable, radius, variant, size },
  });

  return {};
};

export default function ButtonPage() {
  const { button, shop } = useLoaderData();
  const [radiusValue, setRadiusValue] = useState(button?.radius || 0);
  const handleRadiusChange = useCallback((value) => setRadiusValue(value), []);
  const [sizeValue, setSizeValue] = useState(button?.size || "large");
  const handleSizeChange = useCallback((value) => setSizeValue(value), []);

  return (
    <div className="button-page">
      <h1 className="title">Share Button</h1>
      <p className="shop-id">Shop ID: {shop}</p>
      <Form method="post" className="form">
        <BlockStack vertical>
          <RadioButton
            label="Enable Share Buttons"
            helpText="Customers will see the button under product information."
            checked={button?.enable === true}
            id="enabled"
            name="enable"
            value="true"
          />
          <RadioButton
            label="Disable Share Buttons"
            helpText="Customers will not see the button under product."
            checked={button?.enable === false}
            id="disabled"
            name="enable"
            value="false"
          />
          <RangeSlider
            label="Share Button Radius"
            name="radius"
            id="radius"
            min={0}
            max={30}
            value={radiusValue}
            onChange={handleRadiusChange}
            output
          />
          <RadioButton
            label="Share Button Group shall be segmented"
            helpText="Customers will see segmented (joined) buttons."
            checked={button?.variant === "segmented"}
            id="segmented"
            name="variant"
            value="segmented"
          />
          <RadioButton
            label="Button Group shall be gapped"
            helpText="Customers will see gapped buttons."
            checked={button?.variant === "none"}
            id="none"
            name="variant"
            value="none"
          />
          <Select
            label="Select Share Button Size"
            options={[
              { label: "Extra Small", value: "micro" },
              { label: "Small", value: "slim" },
              { label: "Medium", value: "medium" },
              { label: "Large", value: "large" },
            ]}
            name="size"
            id="size"
            onChange={handleSizeChange}
            value={sizeValue}
          />
        </BlockStack>
        <button type="submit">Update Button Settings</button>
      </Form>
      <p className="enable">
        Enable: {button?.enable === true ? "True" : "False"}
      </p>
      <p className="radius">Radius: {button?.radius}</p>
      <p className="size">Size: {button?.size}</p>
      <p className="variant">Variant: {button?.variant}</p>
    </div>
  );
}
