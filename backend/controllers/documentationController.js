const { GoogleGenerativeAI } = require('@google/generative-ai');

// Updated list of experimental models
const GEMINI_MODELS = [
  'gemini-2.0-pro-exp',
  'gemini 2.0 Flash',      // Experimental pro model
  'gemini-2.0-flash-thinking-exp', // Experimental flash thinking model
  'gemini-pro',
  'gemini-1.5-flash',              // Fallback to standard model
  'gemini-1.5-pro'          // Another fallback option
];

exports.generateDocumentation = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Initialize the API with debugging
    console.log('Initializing Gemini AI...');
    const genAI = new GoogleGenerativeAI(apiKey);

    // Try each model with detailed error logging
    const errors = {};

    for (const modelName of GEMINI_MODELS) {
      try {
        console.log(`Attempting to use model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        });

        const prompt = `Generate comprehensive documentation for this ${language} code:\n\n${code}`;
        console.log(`Sending request to model ${modelName}...`);
        
        const result = await model.generateContent(prompt);
        console.log(`Successfully generated content with ${modelName}`);
        
        const response = await result.response;
        return res.json({
          documentation: response.text(),
          modelUsed: modelName,
          success: true
        });

      } catch (modelError) {
        console.error(`Failed with model ${modelName}:`, modelError.message);
        errors[modelName] = modelError.message;
        continue;
      }
    }

    // If we get here, all models failed
    console.error('All models failed. Errors:', errors);
    return res.status(500).json({
      error: 'Documentation generation failed',
      modelErrors: errors,
      triedModels: GEMINI_MODELS,
      tip: 'Please check API key permissions and model availability'
    });

  } catch (error) {
    console.error('Fatal error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};