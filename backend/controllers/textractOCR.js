// textractOCR.js
const fs = require('fs');
const sharp = require('sharp');
const dotenv = require('dotenv');
const { TextractClient, DetectDocumentTextCommand } = require('@aws-sdk/client-textract');

dotenv.config();

async function awsTextractOCR(imagePath) {
  const REGION = process.env.AWS_DEFAULT_REGION;
  const textractClient = new TextractClient({
    region: REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`);
  }

  let imageBuffer;
  try {
    const metadata = await sharp(imagePath).metadata();
    if (metadata.format !== 'jpeg') {
      imageBuffer = await sharp(imagePath).jpeg().toBuffer();
    } else {
      imageBuffer = fs.readFileSync(imagePath);
    }
  } catch (error) {
    throw new Error(`Error processing image: ${error}`);
  }

  const command = new DetectDocumentTextCommand({
    Document: { Bytes: imageBuffer }
  });

  try {
    const response = await textractClient.send(command);
    const extractedText = response.Blocks
      .filter(block => block.BlockType === 'LINE')
      .map(line => line.Text)
      .join('\n');

    return extractedText;
  } catch (err) {
    throw new Error(`Textract failed: ${err}`);
  }
}

module.exports = awsTextractOCR;  
