import { createOllama } from 'ollama-ai-provider';
import { streamText, convertToCoreMessages, CoreMessage, UserContent } from 'ai';

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Destructure request data
  const { messages, selectedModel, data } = await req.json();

  console.log('API Route - Selected model:', selectedModel);
  console.log('API Route - Has images:', !!data?.images?.length);
  console.log('API Route - Number of images:', data?.images?.length || 0);

  const ollamaUrl = process.env.OLLAMA_URL;

  const initialMessages = messages.slice(0, -1); 
  const currentMessage = messages[messages.length - 1]; 

  const ollama = createOllama({baseURL: ollamaUrl + "/api"});

  // Build message content array directly
  const messageContent: UserContent = [{ type: 'text', text: currentMessage.content }];

  // Add images if they exist (base64 images from the frontend)
  if (data?.images?.length > 0) {
    console.log('API Route - Processing images for model:', selectedModel);
    data.images.forEach((imageUrl: string, index: number) => {
      console.log(`API Route - Adding image ${index + 1}, length: ${imageUrl.length}`);
      
      // Strip data URL prefix if present (data:image/png;base64,)
      let base64Data = imageUrl;
      if (imageUrl.startsWith('data:')) {
        const base64Index = imageUrl.indexOf('base64,');
        if (base64Index !== -1) {
          base64Data = imageUrl.substring(base64Index + 7);
        }
      }
      
      console.log(`API Route - Processed image ${index + 1}, base64 length: ${base64Data.length}`);
      
      // For base64 images, we need to pass them as base64 strings
      messageContent.push({ 
        type: 'image', 
        image: base64Data // Pass the clean base64 string
      });
    });
  }

  // Stream text using the ollama model
  try {
    console.log('API Route - Sending request to Ollama with content types:', 
      messageContent.map(item => item.type).join(', '));
    
    const result = await streamText({
      model: ollama(selectedModel),
      messages: [
        ...convertToCoreMessages(initialMessages),
        { role: 'user', content: messageContent },
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Route - Error with model:', selectedModel, error);
    
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error('API Route - Error message:', error.message);
      console.error('API Route - Error stack:', error.stack);
    }
    
    // Check if it's an image-related error with a non-vision model
    if (data?.images?.length > 0 && error instanceof Error && error.message?.includes('vision')) {
      return new Response(
        JSON.stringify({ 
          error: `Model "${selectedModel}" does not support images. Please use a vision-capable model like "llava" or "llava:latest".` 
        }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Generic error response
    return new Response(
      JSON.stringify({ 
        error: `Error processing request: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
