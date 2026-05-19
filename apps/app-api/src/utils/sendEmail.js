const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOrderConfirmation = async (to, order) => {
  await transporter.sendMail({
    from: `"Toraja Coffee" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Konfirmasi Pesanan Toraja Coffee",
    html: `
      <h2>Terima kasih sudah memesan ☕</h2>
      <p>Halo ${order.name}, pesanan kamu berhasil dibuat.</p>

      <p><strong>Total:</strong> Rp ${order.total.toLocaleString("id-ID")}</p>

      <h3>Detail Pesanan:</h3>
      <ul>
        ${order.items.map(item => `
          <li>${item.name} x ${item.qty}</li>
        `).join("")}
      </ul>

      <p>Kami akan segera memproses pesananmu.</p>
    `
  });
};

module.exports = sendOrderConfirmation;