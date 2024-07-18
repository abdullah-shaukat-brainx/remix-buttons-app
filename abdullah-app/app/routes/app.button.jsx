import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import {
  Page,
  RadioButton,
  RangeSlider,
  Select,
  Card,
  Button,
  Divider,
  Text,
  ButtonGroup,
} from "@shopify/polaris";

import { Icon } from "@shopify/polaris";
import { LogoInstagramIcon } from "@shopify/polaris-icons";

import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useState, useCallback } from "react";
import InstagramIcon from "../../public/assets/instagram.png";
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

  const [enableValue, setEnableValue] = useState(
    button?.enable.toString() || "false",
  );
  const handleEnableChange = useCallback(
    (_, newValue) => setEnableValue(newValue),
    [],
  );
  const [variantValue, setVariantValue] = useState(button?.variant || "none");
  const handleVariantChange = useCallback(
    (_, newValue) => setVariantValue(newValue),
    [],
  );

  return (
    <>
      <Page>
        <Card background="bg-fill-success">
          <p className="shop-id">Shop ID: {shop}</p>
        </Card>
        <Card>
          <Form method="post" className="form">
            <RadioButton
              label="Enable Share Buttons"
              helpText="Customers will see the button under product information."
              checked={enableValue === "true"}
              id="true"
              name="enable"
              value="true"
              onChange={handleEnableChange}
            />
            <RadioButton
              label="Disable Share Buttons"
              helpText="Customers will not see the button under product."
              checked={enableValue === "false"}
              id="false"
              name="enable"
              value="false"
              onChange={handleEnableChange}
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
              checked={variantValue === "segmented"}
              id="segmented"
              name="variant"
              value="segmented"
              onChange={handleVariantChange}
            />
            <RadioButton
              label="Button Group shall be gapped"
              helpText="Customers will see gapped buttons."
              checked={variantValue === "none"}
              id="none"
              name="variant"
              value="none"
              onChange={handleVariantChange}
            />
            <Select
              tone="magic"
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
            <Divider borderColor="transparent" />
            <Button submit variant="primary">
              Update Button Settings
            </Button>
          </Form>
        </Card>
        <Card background="bg-fill-info">
          <Text as="h2" variant="headingSm">
            Preview
          </Text>
          <p className="enable">
            Enable: {enableValue === true ? "True" : "False"}
          </p>
          <p className="radius">Radius: {radiusValue}</p>
          <p className="size">Size: {sizeValue}</p>
          <p className="variant">Variant: {variantValue}</p>

          <ButtonGroup variant={variantValue}>
            {enableValue === "true" &&
              [1, 2, 3, 4].map((_, index) => (
                <Button
                  key={index}
                  size={sizeValue}
                  icon={<Icon source={LogoInstagramIcon} />}
                  variant="secondary"
                >
                  Instagram
                </Button>
              ))}
          </ButtonGroup>
        </Card>
      </Page>
    </>
  );
}
