// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import crypto from "crypto";
// import axios from "axios";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const { MERCHANT_ID, SALT_KEY, SALT_INDEX, REDIRECT_URL, PHONEPE_BASE_URL } =
//   process.env;

// console.log("✅ Server Configuration:");
// console.log("   Merchant ID:", MERCHANT_ID);
// console.log("   PhonePe URL:", PHONEPE_BASE_URL);
// console.log("   Redirect URL:", REDIRECT_URL);

// // ✅ Generate X-VERIFY header for authentication
// function generateXVerify(payload, endpoint) {
//   const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
//   const string = base64Payload + endpoint + SALT_KEY;
//   const sha256Hash = crypto.createHash("sha256").update(string).digest("hex");
//   return `${sha256Hash}###${SALT_INDEX}`;
// }

// // ✅ Initiate Payment
// app.post("/api/initiatePayment", async (req, res) => {
//   try {
//     const { amount, userId, mobileNumber, name } = req.body;

//     // Validate input
//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid amount is required",
//       });
//     }

//     const merchantTransactionId = `TXN_${Date.now()}`;

//     const payload = {
//       merchantId: MERCHANT_ID,
//       merchantTransactionId,
//       merchantUserId: userId || `USER_${Date.now()}`,
//       amount: amount * 100, // convert to paise (1 INR = 100 paise)
//       redirectUrl: `${REDIRECT_URL}?txnId=${merchantTransactionId}`,
//       redirectMode: "POST",
//       callbackUrl: `${REDIRECT_URL}?txnId=${merchantTransactionId}`,
//       mobileNumber: mobileNumber || "9999999999",
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };

//     const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
//       "base64"
//     );
//     const xVerify = generateXVerify(payload, "/pg/v1/pay");

//     console.log("📤 Initiating payment:", {
//       merchantTransactionId,
//       amount: amount,
//       userId: payload.merchantUserId,
//     });

//     const response = await axios.post(
//       `${PHONEPE_BASE_URL}/pg/v1/pay`,
//       { request: base64Payload },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "X-VERIFY": xVerify,
//           accept: "application/json",
//         },
//       }
//     );

//     console.log("✅ Payment initiated successfully:", response.data);

//     res.status(200).json({
//       success: true,
//       message: "Payment initiated successfully",
//       transactionId: merchantTransactionId,
//       redirectUrl:
//         response.data?.data?.instrumentResponse?.redirectInfo?.url || null,
//       data: response.data,
//     });
//   } catch (error) {
//     console.error(
//       "❌ Payment initiation error:",
//       error.response?.data || error.message
//     );
//     res.status(500).json({
//       success: false,
//       message: "Payment initiation failed",
//       error: error.response?.data || error.message,
//     });
//   }
// });

// // ✅ Check Payment Status
// app.get("/api/paymentStatus/:transactionId", async (req, res) => {
//   try {
//     const { transactionId } = req.params;
//     const endpoint = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;

//     const string = endpoint + SALT_KEY;
//     const sha256Hash = crypto.createHash("sha256").update(string).digest("hex");
//     const xVerify = `${sha256Hash}###${SALT_INDEX}`;

//     console.log("🔍 Checking payment status for:", transactionId);

//     const response = await axios.get(`${PHONEPE_BASE_URL}${endpoint}`, {
//       headers: {
//         "Content-Type": "application/json",
//         "X-VERIFY": xVerify,
//         accept: "application/json",
//       },
//     });

//     console.log("✅ Payment status retrieved:", response.data);

//     res.status(200).json({
//       success: true,
//       data: response.data,
//     });
//   } catch (error) {
//     console.error(
//       "❌ Payment status check failed:",
//       error.response?.data || error.message
//     );
//     res.status(500).json({
//       success: false,
//       message: "Failed to check payment status",
//       error: error.response?.data || error.message,
//     });
//   }
// });

// // ✅ Handle Payment Callback (Optional - for POST callbacks)
// app.post("/api/payment-callback", (req, res) => {
//   try {
//     console.log("📥 Payment callback received:", req.body);

//     // Verify the callback (implement signature verification here)
//     const callbackData = req.body;

//     res.status(200).json({
//       success: true,
//       message: "Callback received",
//     });
//   } catch (error) {
//     console.error("❌ Callback error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Callback processing failed",
//     });
//   }
// });

// // ✅ Root route
// app.get("/", (req, res) => {
//   res.send(`
//     <h1>✅ PhonePe Payment Gateway Backend</h1>
//     <p>Status: Active (UAT Sandbox Mode)</p>
//     <p>Merchant ID: ${MERCHANT_ID}</p>
//     <h3>Available Endpoints:</h3>
//     <ul>
//       <li>POST /api/initiatePayment - Initiate a payment</li>
//       <li>GET /api/paymentStatus/:transactionId - Check payment status</li>
//       <li>POST /api/payment-callback - Handle payment callbacks</li>
//     </ul>
//   `);
// });

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`🔧 Environment: UAT Sandbox`);
// });

// import express from "express";
// import cors from "cors";
// import { randomUUID } from "crypto";
// import dotenv from "dotenv";
// import { StandardCheckoutClient, Env,  StandardCheckoutPayRequest } from 'pg-sdk-node';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const PORT = process.env.PORT || 5000;

// const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;
// const clientVersion = process.env.CLIENT_VERSION;

// const env = Env.PRODUCTION;

// const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

// app.post("/api/create-order" , async(req, res)=>{
//   try{
//     const{amount } = req.body;
//     if(!amount){
//       return res.status(400).send("Amount is required");
//     }

//     const merchantOrderId= randomUUID();

//     const redirectUrl = `${process.env.REDIRECT_URL}/payment-status?merchantOrderId=${merchantOrderId}`;

//     const request = StandardCheckoutPayRequest.builder().merchantOrderId(merchantOrderId).amount(amount).redirectUrl(redirectUrl).build();

//     const response = await client.pay(request);

//     return res.json({
//       checkoutPageUrl: response.redirectUrl
//     })

//   }catch(err){
//     console.log("error at create order",err);
//     res.status(500).send("Error creating order");
//   }
// })

// app.get("/api/payment-status", async(req,res)=>{
//   try{
//     const {merchantOrderId} = req.query;
//     if(!merchantOrderId){
//       return res.status(400).send("Merchant Order Id is required");
//     }

//     const response = await client.getOrderStatus(merchantOrderId);

//     console.log("response payment status0-0-0-0-0-0-00-0-0-0-0--0-" , response);

//     const status = response.state;
//      if (status === "COMPLETED" || status === "PAID" || status === "SETTLED") {
//       return res.json({ success: true, code: "PAYMENT_SUCCESS" });
//     } else {
//       return res.json({ success: false, code: "PAYMENT_FAILED" });
//     }
//   }catch(err){
//     console.log("error at check status",err);
//     res.status(500).send("Error checking status");
//   }
// })

// app.get("/", (req, res) => {
//   res.send(`
//     <h1>✅ PhonePe Payment Gateway Backend</h1>
//     <p>Status: Active (UAT Sandbox Mode)</p>
//     <p>Merchant ID: ${clientId}</p>
//     <h3>Available Endpoints:</h3>
//     <ul>
//       <li>POST /api/initiatePayment - Initiate a payment</li>
//       <li>GET /api/paymentStatus/:transactionId - Check payment status</li>
//       <li>POST /api/payment-callback - Handle payment callbacks</li>
//     </ul>
//   `);
// });

// app.listen(PORT, () => {
//   console.log("Server is running on port " , PORT);
// });

import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import streamBuffers from "stream-buffers";
import {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
} from "pg-sdk-node";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientVersion = process.env.CLIENT_VERSION;

const env = Env.PRODUCTION;

const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

// ------------------ NODEMAILER TRANSPORT ------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.OWNER_EMAIL, // e.g. "kaarigerandcoo@gmail.com"
    pass: process.env.OWNER_EMAIL_PASS, // Gmail App Password
  },
});

// ------------------ CREATE ORDER ------------------
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).send("Amount is required");

    const merchantOrderId = randomUUID();
    const redirectUrl = `${process.env.REDIRECT_URL}/payment-status?merchantOrderId=${merchantOrderId}`;

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .build();

    const response = await client.pay(request);

    return res.json({
      checkoutPageUrl: response.redirectUrl,
    });
  } catch (err) {
    console.log("error at create order", err);
    res.status(500).send("Error creating order");
  }
});

// ------------------ PAYMENT STATUS + SEND EMAILS ------------------
// app.post("/api/payment-status", async (req, res) => {
//   try {
//     const { merchantOrderId, userData, priceData  , cart } = req.body;
//     console.log("merchantOrderId" , merchantOrderId);
//     console.log("userData" , userData);
//     console.log("priceData" , priceData);
//     console.log("cart" , cart);

//     if (!merchantOrderId) {
//       return res.status(400).send("Merchant Order Id is required");
//     }

//     const response = await client.getOrderStatus(merchantOrderId);
//     const status = response.state;

//     if (status === "COMPLETED" || status === "PAID" || status === "SETTLED") {
//       // PAYMENT SUCCESS -> SEND EMAILS

//       const { name, email, phone, selectedAddress } = userData;
//       const { itemsTotal, discount, finalAmount, couponCode, isCouponApplied } =priceData;

//       const orderTime = new Date().toLocaleString();

//       // ------------------ OWNER EMAIL ------------------
//       const ownerMail = {
//         from: process.env.OWNER_EMAIL,
//         to: "kaarigerandcoo@gmail.com",
//         subject: `New Order Received - ${name}`,
//         html: `
//           <h2>New Order Received</h2>
//           <p><strong>Name:</strong> ${name}</p>
//           <p><strong>Email:</strong> ${email}</p>
//           <p><strong>Phone:</strong> ${phone}</p>
//           <p><strong>Address:</strong> ${selectedAddress}</p>
//           <p><strong>Total Amount:</strong> ₹${itemsTotal}</p>
//           <p><strong>Discount:</strong> ₹${discount}</p>
//           <p><strong>Coupon Code:</strong> ₹${couponCode}</p>
//           <p><strong>isCouponApplied:</strong> ₹${isCouponApplied}</p>
//           <p><strong>Final Amount:</strong> ₹${finalAmount}</p>
//           <p><strong>Merchant Order ID:</strong> ${merchantOrderId}</p>
//           <p><strong>Payment Status:</strong> SUCCESS</p>
//           <p><strong>Order Time:</strong> ${orderTime}</p>
//         `,
//       };

//       await transporter.sendMail(ownerMail);

//       // ------------------ USER CONFIRMATION EMAIL ------------------
//       const userMail = {
//         from: process.env.OWNER_EMAIL,
//         to: email,
//         subject: `Order Confirmed - Thank You ${name}!`,
//         html: `
//           <h2>Order Confirmed 🎉</h2>
//           <p>Hello ${name},</p>
//           <p>Thank you for ordering from Kaariger & Co.</p>
          
//           <h3>Your Order Details:</h3>
//           <p><strong>Total Amount Paid:</strong> ₹${finalAmount}</p>
//           <p><strong>Address:</strong> ${selectedAddress}</p>
//           <p><strong>Order Time:</strong> ${orderTime}</p>

//           <br/>
//           <p>We will process your order shortly.</p>
//           <p>Thank You ❤️</p>
//         `,
//       };

//       await transporter.sendMail(userMail);

//       return res.json({ success: true, code: "PAYMENT_SUCCESS" });
//     } else {
//       return res.json({ success: false, code: "PAYMENT_FAILED" });
//     }
//   } catch (err) {
//     console.log("error at check status", err);
//     res.status(500).send("Error checking status");
//   }
// });

// app.post("/api/payment-status", async (req, res) => {
//   try {
//     const { merchantOrderId, userData, priceData, cart } = req.body;

//     console.log("merchantOrderId", merchantOrderId);
//     console.log("userData", userData);
//     console.log("priceData", priceData);
//     console.log("cart", cart);

//     if (!merchantOrderId) {
//       return res.status(400).send("Merchant Order Id is required");
//     }

//     const response = await client.getOrderStatus(merchantOrderId);
//     console.log("response payment status" , response);
//     const status = response.state;

//     // Convert cart array to html table rows
//     const cartHTML = cart
//       .map(
//         (item) => `
//         <tr>
//           <td>${item?.title}</td>
//           <td>${item?.artType}</td>
//           <td>${item?.category}</td>
//           <td>${item?.selectedFrame}</td>
//           <td>${item?.height} x ${item?.width}</td>
//           <td>${item?.quantity}</td>
//           <td>₹${item?.price}</td>
//           <td>${item?.description}</td>

//         </tr>
//       `
//       )
//       .join("");

//     // FULL CART TABLE
//     const cartTable = `
//       <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width:100%; font-size:14px;">
//         <thead>
//           <tr style="background:#f5f5f5;">
//             <th>Item</th>
//             <th>Art Type</th>
//             <th>Category</th>
//             <th>Frame</th>
//             <th>Size (H x W)</th>
//             <th>Qty</th>
//             <th>Price</th>
//             <th>Description</th>
//           </tr>
//         </thead>
//         <tbody>${cartHTML}</tbody>
//       </table>
//     `;

//     // payment success
//     const { name, email, phone, selectedAddress } = userData;
//     const {
//       itemsTotal,
//       discount,
//       finalAmount,
//       couponCode,
//       isCouponApplied,
//     } = priceData;

//     const orderTime = new Date().toLocaleString();

//     // ------------------ OWNER EMAIL ------------------
//     const ownerMail = {
//       from: process.env.OWNER_EMAIL,
//       to: "kaarigarandcoo@gmail.com",
//       subject: `🛒 New Order Received - ${name}`,
//       html: `
//         <h2>New Order Received</h2>

//         <h3>Customer Details</h3>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Phone:</strong> ${phone}</p>
//         <p><strong>Address:</strong> ${selectedAddress}</p>

//         <h3>Order Summary</h3>
//         <p><strong>Total Amount:</strong> ₹ ${itemsTotal}</p>
//         <p><strong>Discount:</strong> ₹ ${discount}</p>
//         <p><strong>Discount Percentage:</strong> ${(discount/itemsTotal) * 100} %</p>
//         <p><strong>Final Amount Paid:</strong> ₹ ${finalAmount}</p>
//         <p><strong>Coupon Applied:</strong> ${isCouponApplied ? "Yes" : "No"}</p>
//         <p><strong>Coupon Code:</strong> ${couponCode || "N/A"}</p>

//         <h3>Cart Details</h3>
//         ${cartTable}

//         <br/>
//         <p><strong>Merchant Order ID:</strong> ${merchantOrderId}</p>
//         <p><strong>Payment Status:</strong> SUCCESS</p>
//         <p><strong>Order Time:</strong> ${orderTime}</p>
//       `,
//     };

//     const respOwner = await transporter.sendMail(ownerMail);
//     console.log("resp owner side" , respOwner);

//     // ------------------ USER CONFIRMATION EMAIL ------------------
//     const userMail = {
//       from: process.env.OWNER_EMAIL,
//       to: email,
//       subject: `🎉 Order Confirmed - Thank You ${name}!`,
//       html: `
//         <h2>Order Confirmed 🎉</h2>
//         <p>Hello <strong>${name}</strong>,</p>
//         <p>Thank you for ordering from <strong>Kaariger & Co.</strong></p>

//         <h3>Your Order Summary</h3>
//         <p><strong>Total Amount:</strong> ₹ ${itemsTotal}</p>
//         <p><strong>Discount:</strong> ₹ ${discount}</p>
//           <p><strong>Discount Percentage:</strong> ${(discount/itemsTotal) * 100} %</p>
//         <p><strong>Total Amount Paid:</strong> ₹ ${finalAmount}</p>
//         <p><strong>Coupon Applied:</strong> ${isCouponApplied ? "Yes" : "No"}</p>
//         <p><strong>Coupon Code:</strong> ${couponCode || "N/A"}</p>

//         <h3>Delivery Address</h3>
//         <p>${selectedAddress}</p>

//         <h3>Your Ordered Items</h3>
//         ${cartTable}

//         <br/>
//         <p><strong>Order Time:</strong> ${orderTime}</p>

//         <br/>
//         <p>We will process and ship your order soon.</p>
//         <p>Thank you for choosing Kaariger & Co ❤️</p>
//       `,
//     };

//     const respUser = await transporter.sendMail(userMail);
//     console.log("resp user side" , respUser);

//     if (status === "COMPLETED" || status === "PAID" || status === "SETTLED") {

//       return res.json({ success: true, code: "PAYMENT_SUCCESS" });
//     } else {
//       return res.json({ success: false, code: "PAYMENT_FAILED" });
//     }
//   } catch (err) {
//     console.log("Error at check status", err);
//     return res.status(500).send("Error checking status");
//   }
// });

// server.js (or your existing file) - full /api/payment-status implementation

// ensure templates folder and write default templates if missing
const templatesDir = path.join(process.cwd(), "templates");
if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir);

// Helper: default owner template
const ownerTemplatePath = path.join(templatesDir, "owner_email.html");
if (!fs.existsSync(ownerTemplatePath)) {
  fs.writeFileSync(
    ownerTemplatePath,
`<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body { font-family: Arial, sans-serif; color: #333; margin:0; padding:20px; background:#f7f7f7; }
    .card{ background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
    header{ display:flex; align-items:center; gap:12px; }
    header img{ height:48px; }
    h2{ margin:6px 0 14px 0; color:#1a202c; }
    table{ width:100%; border-collapse:collapse; margin-top:12px; }
    th, td{ padding:8px; border:1px solid #e6e6e6; text-align:left; font-size:13px; }
    th{ background:#fafafa; }
    .muted{ color:#666; font-size:13px; }
    .section-title{ margin-top:20px; font-size:15px; border-bottom:1px solid #eee; padding-bottom:6px; }
    .small{ font-size:12px; color:#777; }
  </style>
</head>
<body>
  <div class="card">
    <header>
      <img src="{{BRAND_LOGO_URL}}" alt="{{BRAND_NAME}} logo" onerror="this.style.display='none'"/>
      <div>
        <strong style="font-size:16px">{{BRAND_NAME}}</strong><br/>
        <span class="small">New order notification</span>
      </div>
    </header>

    <h2>New Order Received</h2>

    <div class="section-title">Customer Details</div>
    <p><strong>Name:</strong> {{NAME}}<br/>
    <strong>Email:</strong> {{EMAIL}}<br/>
    <strong>Phone:</strong> {{PHONE}}<br/>
    <strong>Address:</strong> {{ADDRESS}}</p>

    <div class="section-title">Order & Payment Summary</div>
    <p class="muted">
      <strong>Order ID:</strong> {{ORDER_ID}}<br/>
      <strong>PhonePe Status:</strong> {{STATE}}<br/>
      <strong>Amount (paise):</strong> {{AMOUNT}}<br/>
      <strong>Expires at (epoch):</strong> {{EXPIRE_AT}}<br/>
      <strong>Order Time:</strong> {{ORDER_TIME}}
    </p>

    <div class="section-title">Price Summary</div>
    <p>
      <strong>Total:</strong> ₹{{ITEMS_TOTAL}}<br/>
      <strong>Discount:</strong> ₹{{DISCOUNT}}<br/>
      <strong>Final Amount:</strong> ₹{{FINAL_AMOUNT}}<br/>
      <strong>Coupon:</strong> {{COUPON}}
    </p>

    <div class="section-title">Items</div>
    {{CART_TABLE}}

    <div class="section-title">Payment Attempts</div>
    {{PAYMENT_DETAILS_TABLE}}

    <div class="section-title">Split Instruments</div>
    {{SPLIT_TABLE}}

    <p class="small">Meta Info: {{METAINFO}}</p>
  </div>
</body>
</html>`
  );
}

// Helper: default user template
const userTemplatePath = path.join(templatesDir, "user_email.html");
if (!fs.existsSync(userTemplatePath)) {
  fs.writeFileSync(
    userTemplatePath,
`<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    body{ font-family: Arial, sans-serif; color:#333; margin:0; padding:20px; background:#f7f7f7; }
    .card{ background:#fff; border-radius:8px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
    header{ display:flex; align-items:center; gap:12px; }
    header img{ height:42px; }
    h2{ margin:6px 0 14px 0; color:#1a202c; }
    table{ width:100%; border-collapse:collapse; margin-top:12px; }
    th, td{ padding:8px; border:1px solid #e6e6e6; text-align:left; font-size:13px; }
    th{ background:#fafafa; }
    .muted{ color:#666; font-size:13px; }
    .small{ font-size:12px; color:#777; }
    .cta{ display:inline-block; padding:10px 14px; background:#2563eb; color:#fff; border-radius:6px; text-decoration:none; margin-top:8px; }
  </style>
</head>
<body>
  <div class="card">
    <header>
      <img src="{{BRAND_LOGO_URL}}" alt="{{BRAND_NAME}} logo" onerror="this.style.display='none'"/>
      <div>
        <strong style="font-size:16px">{{BRAND_NAME}}</strong><br/>
        <span class="small">Order receipt</span>
      </div>
    </header>

    <h2>Order Confirmation</h2>

    <p>Hello <strong>{{NAME}}</strong>,</p>
    <p>Thanks for your order. Below is a summary of your purchase. A PDF invoice is attached to this email.</p>

    <div class="section-title">Payment Summary</div>
    <p>
      <strong>Order ID:</strong> {{ORDER_ID}}<br/>
      <strong>Payment Status:</strong> {{STATE}}<br/>
      <strong>Transaction ID:</strong> {{TXN_ID}}<br/>
      <strong>Payment Mode:</strong> {{PAYMENT_MODE}}<br/>
      <strong>Amount Paid:</strong> ₹{{FINAL_AMOUNT}}
    </p>

    <div class="section-title">Delivery Address</div>
    <p>{{ADDRESS}}</p>

    <div class="section-title">Items</div>
    {{CART_TABLE}}

    <p class="small">If you have any questions, reply to this email or contact our support.</p>
    <br/>
    <p>Warm regards,<br/>{{BRAND_NAME}}</p>
  </div>
</body>
</html>`
  );
}

// Helper: render templates (simple placeholder replacement)
function renderTemplate(htmlStr, replacements = {}) {
  let out = htmlStr;
  Object.keys(replacements).forEach((key) => {
    const re = new RegExp(`{{${key}}}`, "g");
    out = out.replace(re, replacements[key] == null ? "" : replacements[key]);
  });
  return out;
}

// Helper: create HTML tables for cart, payments, splits
function buildCartTable(cart = []) {
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return "<p>No items</p>";
  }
  const rows = cart
    .map((it) => {
      const desc = (it.description || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<tr>
        <td>${it.title || "-"}</td>
        <td>${it.artType || "-"}</td>
        <td>${it.category || "-"}</td>
        <td>${it.selectedFrame || "-"}</td>
        <td>${it.height || "-"} x ${it.width || "-"}</td>
        <td>${it.quantity || 1}</td>
        <td>₹${(it.price || 0)}</td>
        <td>${desc}</td>
      </tr>`;
    })
    .join("");
  return `
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%;">
      <thead><tr style="background:#fafafa">
        <th>Item</th><th>Art Type</th><th>Category</th><th>Frame</th><th>Size</th><th>Qty</th><th>Price</th><th>Description</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildPaymentDetailsTable(payment_details = []) {
  if (!payment_details || payment_details.length === 0) {
    return "<p>No payment attempts recorded</p>";
  }
  const rows = payment_details
    .map((p) => {
      return `<tr>
        <td>${p.transactionId || "-"}</td>
        <td>${p.paymentMode || "-"}</td>
        <td>${p.timestamp ? new Date(p.timestamp).toLocaleString() : "-"}</td>
        <td>₹${(p.amount != null ? p.amount/100 : "-")}</td>
        <td>${p.state || "-"}</td>
        <td>${p.errorCode || "N/A"}</td>
        <td>${p.detailedErrorCode || "N/A"}</td>
      </tr>`;
    })
    .join("");
  return `
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%;">
      <thead><tr style="background:#fafafa">
        <th>Transaction ID</th><th>Mode</th><th>Time</th><th>Amount</th><th>Status</th><th>Error Code</th><th>Detailed Error</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildSplitTable(splitInstruments = []) {
  if (!splitInstruments || splitInstruments.length === 0) {
    return "<p>No split instruments</p>";
  }
  const rows = splitInstruments
    .map((s) => {
      return `<tr>
        <td>${JSON.stringify(s.instrument) || "-"}</td>
        <td>${JSON.stringify(s.rails) || "-"}</td>
        <td>₹${(s.amount != null ? s.amount/100 : "-")}</td>
      </tr>`;
    })
    .join("");
  return `
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse; width:100%;">
      <thead><tr style="background:#fafafa">
        <th>Instrument</th><th>Rail</th><th>Amount</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// Helper: generate invoice PDF (returns buffer)
async function generateInvoicePDF({
  orderId,
  name,
  email,
  phone,
  address,
  items = [],
  itemsTotal,
  discount,
  finalAmount,
  paymentSummary = {},
  orderTime,
}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const writableBuffer = new streamBuffers.WritableStreamBuffer({
        initialSize: (100 * 1024), // start at 100kb
        incrementAmount: (10 * 1024),
      });
      doc.pipe(writableBuffer);

      // Header
      doc.fontSize(20).text(process.env.BRAND_NAME || "Kaariger & Co", { align: "left" });
      if (process.env.BRAND_LOGO_URL) {
        // We won't fetch external images here; optional enhancement: download the image and embed.
      }
      doc.moveDown();

      doc.fontSize(12).text(`Invoice / Receipt`, { continued: false });
      doc.moveDown(0.5);

      // Order & customer
      doc.fontSize(10);
      doc.text(`Order ID: ${orderId}`);
      doc.text(`Order Time: ${orderTime}`);
      doc.moveDown(0.3);
      doc.text(`Customer: ${name}`);
      doc.text(`Email: ${email}`);
      doc.text(`Phone: ${phone}`);
      doc.text(`Address: ${address}`);
      doc.moveDown(0.5);

      // Items table header
      doc.font("Helvetica-Bold").text("Items", { underline: true });
      doc.moveDown(0.3);
      doc.font("Helvetica");
      // Table mimic (simple)
      items.forEach((it, i) => {
        const title = it.title || `Item ${i + 1}`;
        const qty = it.quantity || 1;
        const price = it.price || 0;
        doc.text(`${i + 1}. ${title} — Qty: ${qty} — Price: ₹${price}`);
      });
      doc.moveDown(0.5);

      // Price summary
      doc.font("Helvetica-Bold").text("Price Summary");
      doc.font("Helvetica");
      doc.text(`Subtotal: ₹${itemsTotal}`);
      doc.text(`Discount: ₹${discount}`);
      doc.text(`Total Paid: ₹${finalAmount}`);
      doc.moveDown(0.5);

      // Payment summary
      if (paymentSummary && Object.keys(paymentSummary).length) {
        doc.font("Helvetica-Bold").text("Payment Summary");
        doc.font("Helvetica");
        doc.text(`Payment Status: ${paymentSummary.state || "-"}`);
        doc.text(`Transaction ID: ${paymentSummary.transactionId || "-"}`);
        doc.text(`Payment Mode: ${paymentSummary.paymentMode || "-"}`);
      }

      doc.moveDown(2);
      doc.fontSize(9).fillColor("#666").text("This is a system generated invoice. For queries, reply to this email.", { align: "left" });

      doc.end();

      writableBuffer.on("finish", () => {
        const buffer = writableBuffer.getContents();
        resolve(buffer);
      });
    } catch (err) {
      reject(err);
    }
  });
}

// ------------------ PAYMENT STATUS ROUTE ------------------
app.post("/api/payment-status", async (req, res) => {
  try {
    const { merchantOrderId, userData = {}, priceData = {}, cart = [] } = req.body;

    console.log("merchantOrderId", merchantOrderId);
    console.log("userData", userData);
    console.log("priceData", priceData);
    console.log("cart", cart);

    if (!merchantOrderId) {
      return res.status(400).send("Merchant Order Id is required");
    }

    // request order status from PhonePe SDK
    const response = await client.getOrderStatus(merchantOrderId);
    console.log("response payment status", response);

    // destructure PhonePe response
    const {
      order_id,
      state,
      amount, // in paise
      expire_at,
      metaInfo,
      payment_details,
      splitInstruments,
    } = response || {};

    // Validate user email before sending
    const { name, email, phone, selectedAddress } = userData;
    if (!email) {
      console.log("User email missing; cannot send user mail");
      // Still send owner email with full details and note that user email missing
    }

    const {
      itemsTotal = 0,
      discount = 0,
      finalAmount = 0,
      couponCode,
      isCouponApplied,
    } = priceData;

    const orderTime = new Date().toLocaleString();

    // Build tables and fragments
    const cartTableHTML = buildCartTable(cart);
    const paymentDetailsTableHTML = buildPaymentDetailsTable(payment_details);
    const splitTableHTML = buildSplitTable(splitInstruments);

    // load templates
    const ownerTemplate = fs.readFileSync(ownerTemplatePath, "utf8");
    const userTemplate = fs.readFileSync(userTemplatePath, "utf8");

    // Prepare replacements for owner
    const ownerHtml = renderTemplate(ownerTemplate, {
      BRAND_LOGO_URL: process.env.BRAND_LOGO_URL || "https://free-teal-w9npugfahz.edgeone.app/logo_1.png",
      BRAND_NAME: process.env.BRAND_NAME || "Kaariger & Co",
      NAME: name || "N/A",
      EMAIL: email || "N/A",
      PHONE: phone || "N/A",
      ADDRESS: selectedAddress || "N/A",
      ORDER_ID: order_id || merchantOrderId,
      STATE: state || "N/A",
      AMOUNT: amount != null ? amount/100 : "N/A",
      EXPIRE_AT: expire_at != null ? expire_at : "N/A",
      ORDER_TIME: orderTime,
      ITEMS_TOTAL: itemsTotal,
      DISCOUNT: discount,
      FINAL_AMOUNT: finalAmount,
      COUPON: couponCode || "N/A",
      CART_TABLE: cartTableHTML,
      PAYMENT_DETAILS_TABLE: paymentDetailsTableHTML,
      SPLIT_TABLE: splitTableHTML,
      METAINFO: JSON.stringify(metaInfo || {}),
    });

    // send owner email (always send owner email)
    const ownerMail = {
      from: process.env.OWNER_EMAIL,
      to: "kaarigarandcoo@gmail.com", // owner
      subject: `🛒 New Order Received - ${name || "Customer"}`,
      html: ownerHtml,
    };

    const ownerResp = await transporter.sendMail(ownerMail);
    console.log("ownerResp", ownerResp);

    // Prepare user email content (cleaned summary)
    // Choose the last successful or last attempt
    const lastPayment = (payment_details || []).slice(-1)[0] || {};
    const userHtml = renderTemplate(userTemplate, {
      BRAND_LOGO_URL: process.env.BRAND_LOGO_URL || "https://free-teal-w9npugfahz.edgeone.app/logo_1.png",
      BRAND_NAME: process.env.BRAND_NAME || "Kaarigar & Co",
      NAME: name || "Customer",
      ORDER_ID: order_id || merchantOrderId,
      STATE: state || "N/A",
      TXN_ID: lastPayment.transactionId || "N/A",
      PAYMENT_MODE: lastPayment.paymentMode || "N/A",
      FINAL_AMOUNT: finalAmount,
      ADDRESS: selectedAddress || "N/A",
      CART_TABLE: cartTableHTML,
    });

    // Generate PDF invoice buffer
    const invoiceBuffer = await generateInvoicePDF({
      orderId: order_id || merchantOrderId,
      name,
      email,
      phone,
      address: selectedAddress,
      items: cart,
      itemsTotal,
      discount,
      finalAmount,
      paymentSummary: lastPayment,
      orderTime,
    });

    // Send user email with attachment (if email present)
    if (email) {
      const userMail = {
        from: process.env.OWNER_EMAIL,
        to: email,
        subject: `🎉 Order Confirmed - Thank You ${name || ""}!`,
        html: userHtml,
        attachments: [
          {
            filename: `invoice_${order_id || merchantOrderId}.pdf`,
            content: invoiceBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      const userResp = await transporter.sendMail(userMail);
      console.log("userResp", userResp);
    } else {
      console.log("User email not available - skipping user mail.");
    }
    // Only send emails if payment is successful
    if (!(state === "COMPLETED" || state === "PAID" || state === "SETTLED")) {
      console.log("Payment not successful, skipping emails. State:", state);
      return res.json({ success: false, code: "PAYMENT_FAILED", state  , order_id});
    }


    return res.json({ success: true, code: "PAYMENT_SUCCESS", state });
  } catch (err) {
    console.error("Error at check status", err);
    return res.status(500).send("Error checking status");
  }
});


// ------------------ ROOT ------------------
app.get("/", (req, res) => {
  res.send(`
    <h1>✅ PhonePe Payment Gateway Backend</h1>
    <p>Status: Active (UAT Sandbox Mode)</p>
    <p>Merchant ID: ${clientId}</p>
    <h3>Available Endpoints:</h3>
    <ul>
      <li>POST /api/initiatePayment - Initiate a payment</li>
      <li>GET /api/paymentStatus/:transactionId - Check payment status</li>
      <li>POST /api/payment-callback - Handle payment callbacks</li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
