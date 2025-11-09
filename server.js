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



import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import { StandardCheckoutClient, Env,  StandardCheckoutPayRequest } from 'pg-sdk-node';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientVersion = process.env.CLIENT_VERSION;

const env = Env.PRODUCTION;

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

app.post("/api/create-order" , async(req, res)=>{
  try{
    const{amount } = req.body;
    if(!amount){
      return res.status(400).send("Amount is required");
    }

    const merchantOrderId= randomUUID();

    const redirectUrl = `${process.env.REDIRECT_URL}/payment-status?merchantOrderId=${merchantOrderId}`;

    const request = StandardCheckoutPayRequest.builder().merchantOrderId(merchantOrderId).amount(amount).redirectUrl(redirectUrl).build();

    const response = await client.pay(request);

    return res.json({
      checkoutPageUrl: response.redirectUrl
    })

  }catch(err){
    console.log("error at create order",err);
    res.status(500).send("Error creating order");
  }
})

app.get("/api/payment-status", async(req,res)=>{
  try{
    const {merchantOrderId} = req.query;
    if(!merchantOrderId){
      return res.status(400).send("Merchant Order Id is required");
    }

    const response = await client.getOrderStatus(merchantOrderId);
    
    const status = response.status;
    if(status === "COMPLETED" || status === "PAID" || status === "SETTLED"){
      return res.redirect(`${process.env.REDIRECT_URL}/success`)
    }else{
      return res.redirect(`${process.env.REDIRECT_URL}/failure`)
    }
  }catch(err){
    console.log("error at check status",err);
    res.status(500).send("Error checking status");
  }
})

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
  console.log("Server is running on port " , PORT);
});
