import {
  LegacyStack,
  Tag,
  ChoiceList,
  TextContainer,
  Page,
  Card,
  Button,
} from "@shopify/polaris";
import { useState, useCallback, useMemo } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const platforms = await prisma.platform.findMany();
  return json({ platforms, shop });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  // Handle form submission logic here
  return {};
};

function MultiChoiceListExample() {
  const { platforms, shop } = useLoaderData();

  const choices = useMemo(() => {
    return platforms.map((platform) => ({
      value: platform.name,
      label: platform.name,
    }));
  }, [platforms]);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = useCallback((value) => setSelectedOptions(value), []);

  return (
    <Page>
      <Card background="bg-fill-info">
        <p className="shop-id">Shop ID: {shop}</p>
      </Card>
      <Card>
        <Form method="post">
          <ChoiceList
            name="platforms"
            allowMultiple
            title="Select social platforms"
            choices={choices}
            selected={selectedOptions}
            onChange={handleChange}
          />
          <Button submit variant="primary" fullWidth>
            Update Platforms List
          </Button>
        </Form>
      </Card>
      <Card sectioned>
        <TextContainer>
          <p>Currently Selected Platforms:</p>
          <LegacyStack>
            {selectedOptions.map((option) => (
              <Tag key={option}>{option}</Tag>
            ))}
          </LegacyStack>
        </TextContainer>
      </Card>
    </Page>
  );
}

export default MultiChoiceListExample;
