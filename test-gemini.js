#!/usr/bin/env node

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiModels() {
    console.log('🧪 Testing Gemini API with different configurations\n');

    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyClqSg67l798BbUizTA_LzNpamcD9vN6j4';

    if (!apiKey) {
        console.error('❌ No API key provided');
        process.exit(1);
    }

    console.log('✅ Using API key:', apiKey.substring(0, 20) + '...\n');

    // Try different model names with v1 API
    const modelsToTest = [
        'models/gemini-1.5-flash',
        'models/gemini-1.5-pro',
        'models/gemini-pro',
        'gemini-1.5-flash-001',
        'gemini-1.5-flash-002',
        'gemini-1.5-pro-001',
        'gemini-pro-vision',
    ];

    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of modelsToTest) {
        console.log(`🔍 Testing: ${modelName}`);

        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hi');
            const response = await result.response;
            const text = response.text();

            console.log(`✅ SUCCESS! Model works: ${modelName}`);
            console.log(`   Response: ${text.trim()}\n`);
            break; // Found a working model, stop testing
        } catch (error) {
            console.log(`❌ Failed: ${error.message.substring(0, 100)}...\n`);
        }
    }
}

testGeminiModels().catch(console.error);
