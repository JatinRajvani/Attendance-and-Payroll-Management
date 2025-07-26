const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const { getDB } = require("../../config/db");


exports.setPassword = async (req, res) => {
  const { token, password } = req.body;
  const db = getDB();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.collection("users").findOne({ email: decoded.email });

    if (!user || user.passwordSetToken !== token || new Date() > new Date(user.tokenExpiry)) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.collection("users").updateOne(
      { email: decoded.email },
      {
        $set: { password: hashed },
        $unset: { passwordSetToken: "", tokenExpiry: "" },
      }
    );

    res.status(200).json({ message: "Password set successfully. You can now log in." });
  } catch (err) {
    res.status(400).json({ message: "Invalid token", error: err.message });
  }
};

// exports.sendWelcomeMail = async (req, res) => {
//   const { email, name, token } = req.body;

//   try {
//     const link = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

//     await transporter.sendMail({
//       from: `"Payroll App" <${process.env.SMTP_EMAIL}>`,
//       to: email,
//       subject: "Welcome to the Team – Set Your Password",
//       html: `
//         <p>Hello <strong>${name}</strong>,</p>
//         <p>Your HR has created an account for you.</p>
//         <p>Click the link below to set your password (valid for 1 hour):</p>
//         <a href="${link}">${link}</a>
//         <br /><br />
//         <p>If you weren't expecting this email, you can ignore it.</p>
//       `,
//     });

//     res.status(200).json({ message: "Email sent successfully" });
//   } catch (err) {
//     console.error("Email error:", err.message);
//     res.status(500).json({ message: "Failed to send email", error: err.message });
//   }
// };
