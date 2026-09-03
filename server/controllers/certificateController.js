import PDFDocument from "pdfkit";

export function generateCertificate(req, res) {
  try {
    const { studentName, courseTitle } = req.body;

    if (!studentName || !courseTitle) {
      return res
        .status(400)
        .json({ error: "studentName and courseTitle are required" });
    }

    const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 0 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf",
    );
    doc.pipe(res);

    const W = doc.page.width;
    const H = doc.page.height;

    // Cream/off-white background for a classic certificate feel
    doc.rect(0, 0, W, H).fill("#faf7f0");

    // Outer ornate border (double line, gold-ish)
    doc
      .rect(24, 24, W - 48, H - 48)
      .lineWidth(3)
      .stroke("#b8860b");
    doc
      .rect(34, 34, W - 68, H - 68)
      .lineWidth(1)
      .stroke("#b8860b");

    // Corner flourishes
    const corner = 24;
    [
      [40, 40, 1, 1],
      [W - 40, 40, -1, 1],
      [40, H - 40, 1, -1],
      [W - 40, H - 40, -1, -1],
    ].forEach(([x, y, dx, dy]) => {
      doc
        .moveTo(x, y + corner * dy)
        .lineTo(x, y)
        .lineTo(x + corner * dx, y)
        .lineWidth(2)
        .stroke("#b8860b");
    });

    // Header ribbon area
    doc
      .fontSize(11)
      .fillColor("#8b6914")
      .font("Helvetica-Bold")
      .text(
        "A I   T U T O R   •   I N T E L L I G E N T   L E A R N I N G   P L A T F O R M",
        0,
        62,
        {
          align: "center",
          characterSpacing: 1,
        },
      );

    // Decorative seal (circle) top center
    const sealX = W / 2;
    const sealY = 105;
    doc.circle(sealX, sealY, 26).lineWidth(2).stroke("#b8860b");
    doc.circle(sealX, sealY, 21).lineWidth(0.75).stroke("#b8860b");
    doc
      .fontSize(9)
      .fillColor("#b8860b")
      .font("Helvetica-Bold")
      .text("NOVA", sealX - 20, sealY - 10, { width: 40, align: "center" });
    doc
      .fontSize(6)
      .fillColor("#8b6914")
      .font("Helvetica")
      .text("VERIFIED", sealX - 20, sealY + 2, { width: 40, align: "center" });

    // Title
    doc
      .fontSize(34)
      .fillColor("#2d2417")
      .font("Helvetica-Bold")
      .text("Certificate of Completion", 0, 155, { align: "center" });

    // Ornamental rule under title
    doc
      .moveTo(W / 2 - 100, 200)
      .lineTo(W / 2 + 100, 200)
      .lineWidth(1)
      .stroke("#b8860b");
    doc.circle(W / 2, 200, 3).fill("#b8860b");

    // "presented to"
    doc
      .fontSize(13)
      .fillColor("#57534e")
      .font("Helvetica-Oblique")
      .text("This certificate is proudly presented to", 0, 218, {
        align: "center",
      });

    // Student name (large, elegant)
    doc
      .fontSize(38)
      .fillColor("#7c2d12")
      .font("Helvetica-Bold")
      .text(studentName, 0, 248, { align: "center" });

    // Underline beneath name
    const nameWidth = doc.widthOfString(studentName, { fontSize: 38 });
    doc
      .moveTo(W / 2 - nameWidth / 2 - 30, 296)
      .lineTo(W / 2 + nameWidth / 2 + 30, 296)
      .lineWidth(0.75)
      .stroke("#b8860b");

    // Completion text
    doc
      .fontSize(13)
      .fillColor("#57534e")
      .font("Helvetica-Oblique")
      .text("for successfully completing the course", 0, 316, {
        align: "center",
      });

    doc
      .fontSize(21)
      .fillColor("#2d2417")
      .font("Helvetica-Bold")
      .text(courseTitle, 60, 342, { align: "center", width: W - 120 });

    // Footer: date left, signature right
    const footerY = H - 100;
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc
      .moveTo(90, footerY)
      .lineTo(280, footerY)
      .lineWidth(0.75)
      .stroke("#b8860b");
    doc
      .fontSize(10)
      .fillColor("#57534e")
      .font("Helvetica")
      .text(today, 90, footerY + 6, { width: 190, align: "center" });
    doc
      .fontSize(9)
      .fillColor("#8b6914")
      .font("Helvetica-Bold")
      .text("DATE OF COMPLETION", 90, footerY + 20, {
        width: 190,
        align: "center",
      });

    doc
      .moveTo(W - 280, footerY)
      .lineTo(W - 90, footerY)
      .lineWidth(0.75)
      .stroke("#b8860b");
    doc
      .fontSize(16)
      .fillColor("#2d2417")
      .font("Helvetica-Bold")
      .text("Nova", W - 280, footerY - 22, { width: 190, align: "center" });
    doc
      .fontSize(9)
      .fillColor("#8b6914")
      .font("Helvetica-Bold")
      .text("AI TUTOR — AUTHORIZED SIGNATURE", W - 280, footerY + 20, {
        width: 190,
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate certificate" });
  }
}
