// api/index.js
const express = require('express');
const app = express();

// Trust the proxy to get accurate client IPs
app.set('trust proxy', true);

// Route to get IP address
app.get("/get-ip", (req, res) => {
  // Check various headers that might contain the IP
  const ip = 
    req.headers['x-forwarded-for']?.split(',')[0].trim() || 
    req.headers['x-real-ip'] || 
    req.headers['x-client-ip'] || 
    req.headers['cf-connecting-ip'] || // Cloudflare
    req.socket.remoteAddress ||
    '0.0.0.0';
  
  res.json({ ip });
});

// Add a test page to visualize the IP
app.get("/ip-test", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>IP Test</title>
      <style>
        body { font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .result { margin-top: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>IP Detection Test</h1>
      <div class="result" id="result">Checking your IP...</div>
      
      <script>
        fetch('/get-ip')
          .then(response => response.json())
          .then(data => {
            document.getElementById('result').innerHTML = 
              '<strong>Your IP:</strong> ' + data.ip;
          })
          .catch(error => {
            document.getElementById('result').innerHTML = 
              'Error: ' + error.message;
          });
      </script>
    </body>
    </html>
  `);
});


app.get("/ip-details", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Network Information</title>
    </head>
    <body>
      <h1>Network Information</h1>
      <div id="publicInfo">Loading public info...</div>
      <p>Note: Detailed local network information cannot be accessed through a browser.</p>
      
      <script>
        // This will only show limited network information
        fetch('/get-ip')
          .then(response => response.json())
          .then(data => {
            document.getElementById('publicInfo').innerHTML = 
              '<strong>Your Public IP:</strong> ' + data.ip;
            
            // We can add more info like browser details
            const browserInfo = navigator.userAgent;
            const div = document.createElement('div');
            div.innerHTML = '<strong>Browser Info:</strong> ' + browserInfo;
            document.body.appendChild(div);
          });
      </script>
    </body>
    </html>
  `);
});
// For Vercel, we need to export the Express app as the default module
module.exports = app;