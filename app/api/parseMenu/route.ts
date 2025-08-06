// app/api/parseMenu/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import { Together } from "together-ai"
import { z } from "zod"
import zodToJsonSchema from "zod-to-json-schema"

// Configure the Together client (with optional Helicone observability)
const options: ConstructorParameters<typeof Together>[0] = {}
if (process.env.HELICONE_API_KEY) {
  options.baseURL = "https://together.helicone.ai/v1"
  options.defaultHeaders = {
    "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY}`,
    "Helicone-Property-MENU": "true",
  }
}
const together = new Together(options)

export async function POST(request: NextRequest) {
  try {
    const { menuUrl } = await request.json()
    if (!menuUrl) {
      return NextResponse.json(
        { error: "No menu URL provided" },
        { status: 400 }
      )
    }

    // 1️⃣ Use the vision-capable model to parse the menu text
    const systemPrompt = `
You are given an image of a menu. Your job is to convert each menu item
into JSON of the form:
  [{"name":"…","price":"…","description":"…"}, …]
Only return raw JSON.
`
    const visionOutput = await together.chat.completions.create({
      model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
      messages: [
        { role: "user", content: systemPrompt },
        {
          role: "user",
          // @ts-expect-error: image_url message type not typed in Together's defs
          content: [{ type: "image_url", image_url: { url: menuUrl } }],
        },
      ],
    })
    const rawMenu = visionOutput.choices?.[0]?.message?.content
    if (!rawMenu) {
      return NextResponse.json(
        { error: "Failed to parse menu text" },
        { status: 500 }
      )
    }

    // 2️⃣ Enforce a strict JSON schema on that raw output
    const menuSchema = z.array(
      z.object({
        name: z.string(),
        price: z.string(),
        description: z.string(),
      })
    )
    const jsonSchema = zodToJsonSchema(menuSchema, "MenuSchema")
    const extractOutput = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [
        { role: "system", content: "Return only JSON matching the schema." },
        { role: "user", content: rawMenu },
      ],
      // @ts-expect-error: response_format not typed in Together's defs
      response_format: { type: "json_object", schema: jsonSchema },
    })
    const content = extractOutput.choices?.[0]?.message?.content
    if (!content) {
      return NextResponse.json(
        { error: "Schema extraction failed" },
        { status: 500 }
      )
    }
    const menuItems: any[] = JSON.parse(content)

    // 3️⃣ Generate images for each item in parallel
    const imagePromises = menuItems.map(async (item) => {
      const resp = await together.images.create({
        prompt: `Hyper-realistic photo of ${item.name}: ${item.description}`,
        model: "black-forest-labs/FLUX.1-schnell",
        width: 1024,
        height: 768,
        steps: 5,
        // @ts-expect-error: response_format not typed in Together's defs
        response_format: "base64",
      })
      item.menuImage = resp.data[0]
      return item
    })
    await Promise.all(imagePromises)

    return NextResponse.json({ menu: menuItems })
  } catch (err) {
    console.error("API /parseMenu error:", err)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
