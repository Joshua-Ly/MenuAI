# MenuAI

A Next.js + Tailwind CSS app that lets you visualize your restaurant menu items with AI-generated images. Upload a photo of your paper or PDF menu, and MenuAI will parse each dish, fetch or generate a photo for it, and display an interactive gallery to help you decide what to order.

---

## Features

- **Upload & Parse**  
  Drag-and-drop or select any JPG/PNG menu photo. Uses Next.js API route to call an AI parser.
- **AI-Generated Dish Images**  
  For each parsed dish name, generates or fetches an illustrative image.
- **Search & Filter**  
  Quickly filter menu items by name with a live search box.
- **Responsive Design**  
  Fully responsive layout built with Tailwind CSS.

---

## Technologies

- **Next.js 14** (App Router)  
- **TypeScript**  
- **Tailwind CSS**  
- **next-s3-upload** for easy S3 file uploads  
- **react-dropzone** for drag-and-drop file selection  

---

## Getting Started

### Prerequisites

- Node.js >= 18  
- npm or Yarn  
- An S3-compatible bucket (e.g. AWS S3) if you want real uploads  
- (Optional) API key or endpoint for your AI image generator

### Installation

1. **Clone** 
   ```bash
   git clone https://github.com/Joshua-Ly/MenuAI.git
   cd menuAI
2. **Install Dependencies**
   ```bash
    npm install
    # or
    yarn
3. **Set Up Environment Variables**
    ```bash
    TOGETHER_API_KEY=...
    S3_UPLOAD_BUCKET=your‐s3‐bucket‐name
    S3_ACCESS_KEY_ID=…
    S3_SECRET_ACCESS_KEY=…
    S3_REGION=…
4. **Run The Development Server**
    ```bash
    npm run dev