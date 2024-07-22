import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import {
  Page,
  RadioButton,
  Select,
  Card,
  Button,
  Divider,
  Text,
  ButtonGroup,
  Spinner,
  SkeletonBodyText,
} from "@shopify/polaris";

import { Icon } from "@shopify/polaris";

import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { useState, useCallback } from "react";
import { useNavigation } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const button = await prisma.button.findUnique({
    where: { id: shop },
  });
  const platforms = await prisma.platform.findMany();
  return json({ platforms, button, shop });
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  const formData = await request.formData();
  const enable = formData.get("enable") === "true";
  const showName = formData.get("showName") === "true";
  const variant = formData.get("variant");
  const size = formData.get("size");

  if (enable == null || showName == null || !variant || !size) {
    return json({ error: "Cannot accept a missing field" }, { status: 400 });
  }

  await prisma.button.upsert({
    where: { id: shop },
    update: { enable, showName, variant, size },
    create: { id: shop, enable, showName, variant, size },
  });

  return {};
};

export default function ButtonPage() {
  const { platforms, button, shop } = useLoaderData();
  const [sizeValue, setSizeValue] = useState(button?.size || "large");
  const handleSizeChange = useCallback((value) => setSizeValue(value), []);
  const handleEnableChange = useCallback(
    (_, newValue) => setEnableValue(newValue),
    [],
  );
  const [enableValue, setEnableValue] = useState(
    button?.enable.toString() || "false",
  );

  const [showNameValue, setShowNameValue] = useState(button?.showName || false);
  const handleShowNameChange = useCallback(
    (_, newValue) => setShowNameValue(newValue),
    [],
  );
  const [variantValue, setVariantValue] = useState(button?.variant || "none");
  const handleVariantChange = useCallback(
    (_, newValue) => setVariantValue(newValue),
    [],
  );

  const navigation = useNavigation();
  if (navigation.state !== "idle") {
    return (
      <Page>
        <Card>
          <SkeletonBodyText />
          <Spinner accessibilityLabel="Spinner example" size="large" />
          <SkeletonBodyText />
        </Card>
      </Page>
    );
  }
  return (
    <>
      <Page
        title="Button Appearance Settings"
        subtitle="Choose how should your share buttons look like"
      >
        <Card background="bg-fill-success">
          <p className="shop-id">Shop ID: {shop}</p>
        </Card>
        <Card>
          <Form method="post" className="form">
            <Text variant="headingMd" as="h6">
              Enable/Disable Buttons
            </Text>
            <RadioButton
              label="Enable"
              helpText="Customers will see the button under product information."
              checked={enableValue === "true"}
              id="true"
              name="enable"
              value="true"
              onChange={handleEnableChange}
            />
            <RadioButton
              label="Disable"
              helpText="Customers will not see the button under product."
              checked={enableValue === "false"}
              id="false"
              name="enable"
              value="false"
              onChange={handleEnableChange}
            />
            <Text variant="headingMd" as="h6">
              Show/Hide Button Names
            </Text>
            <RadioButton
              label="Show"
              helpText="Customers will see the names of the buttons."
              checked={showNameValue === true}
              id={true}
              name="showName"
              value={true}
              onChange={handleShowNameChange}
            />
            <RadioButton
              label="Hide"
              helpText="Customers will not see the names of the buttons."
              checked={showNameValue === false}
              id={false}
              value={false}
              name="showName"
              onChange={handleShowNameChange}
            />
            <Text variant="headingMd" as="h6">
              Choose Button Display Type
            </Text>
            <RadioButton
              label="Segmented"
              helpText="Customers will see segmented (joined) buttons."
              checked={variantValue === "segmented"}
              id="segmented"
              name="variant"
              value="segmented"
              onChange={handleVariantChange}
            />
            <RadioButton
              label="Gapped"
              helpText="Customers will see gapped buttons."
              checked={variantValue === "none"}
              id="none"
              name="variant"
              value="none"
              onChange={handleVariantChange}
            />
            <Text variant="headingMd" as="h6">
              Size
            </Text>
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
            <Divider borderColor="transparent" />
            <Divider borderColor="transparent" />
            <Divider borderColor="transparent" />

            <Button submit variant="primary" fullWidth>
              Update Button Settings
            </Button>
          </Form>
        </Card>
        <Divider />
        <Divider />
        <Divider />
        <Card background="bg-fill-info">
          <Text as="h2" variant="headingSm">
            Preview
          </Text>

          <ButtonGroup variant={variantValue}>
            {enableValue === "true" &&
              platforms.map((platform) => (
                <Button
                  key={platform?.name}
                  size={sizeValue}
                  icon={<Icon source={platform?.iconSvg} />}
                  variant="secondary"
                >
                  {showNameValue === true && platform?.name}
                </Button>
              ))}
          </ButtonGroup>
        </Card>
      </Page>
    </>
  );
}
