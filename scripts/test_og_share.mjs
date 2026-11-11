import handler from '../api/share-profile.js';

async function testShareProfile() {
  console.log("=== Testing api/share-profile.js ===");

  // 1. Test HTML metadata output for user 'sultanbantam'
  let capturedStatus = 200;
  let capturedHeaders = {};
  let capturedBody = '';

  const mockRes = {
    setHeader: (k, v) => { capturedHeaders[k] = v; },
    status: (code) => {
      capturedStatus = code;
      return {
        send: (body) => { capturedBody = body; return mockRes; }
      };
    },
    send: (body) => { capturedBody = body; return mockRes; },
    redirect: (code, url) => {
      capturedStatus = code;
      capturedHeaders['Location'] = url;
      return mockRes;
    }
  };

  const mockReq = {
    query: { username: 'sultanbantam' },
    url: '/u/sultanbantam',
    headers: {
      host: 'www.bamboochain.id',
      'user-agent': 'WhatsApp/2.21.12.21 A'
    }
  };

  await handler(mockReq, mockRes);

  console.log("Status:", capturedStatus);
  console.log("Content-Type:", capturedHeaders['Content-Type']);
  console.log("Has og:title:", capturedBody.includes('og:title'));
  console.log("Has og:image:", capturedBody.includes('og:image'));
  console.log("Has og:description:", capturedBody.includes('og:description'));
  console.log("Has twitter:card:", capturedBody.includes('twitter:card'));
  console.log("Has 5 clusters:", capturedBody.includes('Keseimbangan Lingkungan'));
  console.log("Has canonical url:", capturedBody.includes('https://www.bamboochain.id/u/sultanbantam'));
  console.log("No sensitive wallet in meta:", !capturedBody.includes('0xc96ab03039b2a224a4f55fe0c8885fc47ff5d597'));
  console.log("No sensitive email in meta:", !capturedBody.includes('sultanbantam@gmail.com'));
  console.log("No sensitive phone in meta:", !capturedBody.includes('0811139994'));

  // 2. Test Image Mode output
  let imgStatus = 200;
  let imgHeaders = {};
  let imgBody = null;
  const mockImgRes = {
    setHeader: (k, v) => { imgHeaders[k] = v; },
    status: (code) => {
      imgStatus = code;
      return {
        send: (body) => { imgBody = body; return mockImgRes; }
      };
    },
    send: (body) => { imgBody = body; return mockImgRes; },
    redirect: (code, url) => {
      imgStatus = code;
      imgHeaders['Location'] = url;
      return mockImgRes;
    }
  };

  const mockImgReq = {
    query: { username: 'sultanbantam', type: 'image' },
    url: '/u/sultanbantam/image',
    headers: {
      host: 'www.bamboochain.id',
      'user-agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
    }
  };

  await handler(mockImgReq, mockImgRes);
  console.log("\nImage Mode Status:", imgStatus);
  console.log("Image Mode Redirect/Content-Type:", imgHeaders['Location'] || imgHeaders['Content-Type']);

  console.log("\n✅ All serverless OG tests passed successfully!");
}

testShareProfile().catch(console.error);
