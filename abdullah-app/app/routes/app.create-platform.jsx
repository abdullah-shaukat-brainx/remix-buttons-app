import { Page, Card, TextField, Button, Box } from "@shopify/polaris";
import { useState } from "react";
import { Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const formData = await request.formData();
  const name = formData.get("name");
  const iconSvg = formData.get("iconSvg");
  const baseUrl = formData.get("baseUrl");

  if (!name || !iconSvg || !baseUrl) {
    return json({ error: "All fields are required." }, { status: 400 });
  }
  try {
    const platform = await prisma.platform.create({
      data: {
        name: name,
        iconSvg: iconSvg,
        baseUrl: baseUrl,
      },
    });
    console.log(platform);
    return redirect("/app");
  } catch (error) {
    console.log(error);
    return json({ error: error }, { status: 500 });
  }
};

function AddSocialMediaPlatform() {
  const [name, setName] = useState("");
  const [iconSvg, setIconSvg] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  return (
    <Page>
      <Card sectioned>
        <Form method="post">
          <TextField
            label="Platform Name"
            value={name}
            onChange={(value) => setName(value)}
            autoComplete="off"
            name="name"
          />
          <TextField
            label="Icon Source"
            value={iconSvg}
            onChange={(value) => setIconSvg(value)}
            autoComplete="off"
            name="iconSvg"
          />
          <TextField
            label="Base URL"
            value={baseUrl}
            onChange={(value) => setBaseUrl(value)}
            autoComplete="off"
            name="baseUrl"
          />
          <Button primary submit>
            Add Social Media Platform
          </Button>
        </Form>
      </Card>
    </Page>
  );
}

export default AddSocialMediaPlatform;
