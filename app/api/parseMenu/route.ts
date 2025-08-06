/* eslint-disable @typescript-eslint/no-explicit-any */
import { Together } from "together-ai";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { NextResponse } from "next/server";

// Force this route to be treated as fully dynamic (skip build-time data collection)
export const dynamic = "force-dynamic";

// Stub out GET so Next doesn’t try to prerender using your POST logic
export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405 }
  );
}

// Handle your real work in POST, initializing your client inside the handler
export async function POST(request: Request) {
  // Build together.ai client options only when a request actually comes in
  const options: ConstructorParameters<typeof Together>[0] = {};
  if (process.env.HELICONE_API_KEY) {
    options.baseURL = "https://together.helicone.ai/v1";
    options.defaultHeaders = {
      "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
      "Helicone-Property-MENU": "true",
    };
  }
  const together = new Together(options);

  // Parse the incoming JSON
  const { menuUrl } = await request.json();
  console.log({ menuUrl });
  if (!menuUrl) {
    return NextResponse.json(
      { error: "No menu URL provided" },
      { status: 400 }
    );
  }

  // First prompt: extract text from the menu image
  const systemPrompt = `You are given an image of a menu. Your job is to take each item in the menu and convert it into the following JSON format:

[{"name": "name of menu item", "price": "price of the menu item", "description": "description of menu item"}, ...]

Please make sure to include all items in the menu and include a price (if it exists) & a description (if it exists). ALSO PLEASE ONLY RETURN JSON. IT'S VERY IMPORTANT FOR MY JOB THAT YOU ONLY RETURN JSON.
`;
  const output = await together.chat.completions.create({
    model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
    messages: [
      {
        role: "user",
        // @ts-expect-error api is not typed
        content: [
          { type: "text", text: systemPrompt },
          {
            type: "image_url",
            image_url: { url: menuUrl },
          },
        ],
      },
    ],
  });
  const menuItems = output?.choices?.[0]?.message?.content;

  // Define and compile the Zod schema for post-processing
  const menuSchema = z.array(
    z.object({
      name: z.string().describe("The name of the menu item"),
      price: z.string().describe("The price of the menu item"),
      description: z
        .string()
        .describe(
          "The description of the menu item. If this doesn't exist, please write a short one sentence description."
        ),
    })
  );
  const jsonSchema = zodToJsonSchema(menuSchema, "menuSchema");

  // Second prompt: validate & coerce into strict JSON
  const extract = await together.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    messages: [
      {
        role: "system",
        content:
          "The following is a list of items from a menu. Only answer in JSON.",
      },
      { role: "user", content: menuItems! },
    ],
    // @ts-expect-error - not typed in the API
    response_format: { type: "json_object", schema: jsonSchema },
  });

  let menuItemsJSON: any[] = [];
  if (extract?.choices?.[0]?.message?.content) {
    menuItemsJSON = JSON.parse(
      extract.choices[0].message.content
    );
    console.log({ menuItemsJSON });
  }

  // Kick off parallel image generations for each menu item
  const imagePromises = menuItemsJSON.map(async (item: any) => {
    console.log("processing image for:", item.name);
    const response = await together.images.create({
      prompt: `A picture of food for a menu, hyper realistic, highly detailed, ${item.name}, ${item.description}.`,
      model: "black-forest-labs/FLUX.1-schnell",
      width: 1024,
      height: 768,
      steps: 5,
      // @ts-expect-error - not typed in the API
      response_format: "base64",
    });
    item.menuImage = response.data[0];
    return item;
  });
  await Promise.all(imagePromises);

  // And finally return the fully built menu
  return NextResponse.json({ menu: menuItemsJSON });
}

// Allow up to 60 seconds for all of this to run
export const maxDuration = 60;
