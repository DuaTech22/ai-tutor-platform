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

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Background
    doc.rect(0, 0, pageWidth, pageHeight).fill("#0f172a");

    // Outer decorative border
    doc
      .rect(20, 20, pageWidth - 40, pageHeight - 40)
      .lineWidth(2)
      .stroke("#6366f1");

    // Inner thin border
    doc
      .rect(32, 32, pageWidth - 64, pageHeight - 64)
      .lineWidth(0.5)
      .stroke("#818cf8");

    // Corner accents
    const cornerSize = 30;
    [
      [40, 40],
      [pageWidth - 40 - cornerSize, 40],
      [40, pageHeight - 40 - cornerSize],
      [pageWidth - 40 - cornerSize, pageHeight - 40 - cornerSize],
    ].forEach(([x, y]) => {
      doc
        .moveTo(x, y + cornerSize)
        .lineTo(x, y)
        .lineTo(x + cornerSize, y)
        .lineWidth(3)
        .stroke("#6366f1");
    });

    // Logo / brand mark
    doc
      .fontSize(20)
      .fillColor("#818cf8")
      .font("Helvetica-Bold")
      .text("AI TUTOR", 0, 70, { align: "center" });

    doc
      .fontSize(10)
      .fillColor("#94a3b8")
      .font("Helvetica")
      .text("Intelligent Learning Platform", 0, 95, { align: "center" });

    // Decorative line
    doc
      .moveTo(pageWidth / 2 - 60, 120)
      .lineTo(pageWidth / 2 + 60, 120)
      .lineWidth(1)
      .stroke("#6366f1");

    // Title
    doc
      .fontSize(36)
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .text("Certificate of Completion", 0, 150, { align: "center" });

    // Subtext
    doc
      .fontSize(13)
      .fillColor("#cbd5e1")
      .font("Helvetica")
      .text("This certificate is proudly presented to", 0, 210, {
        align: "center",
      });

    // Student name
    doc
      .fontSize(32)
      .fillColor("#818cf8")
      .font("Helvetica-Bold")
      .text(studentName, 0, 240, { align: "center" });

    // Underline beneath name
    const nameWidth = doc.widthOfString(studentName, { fontSize: 32 });
    doc
      .moveTo(pageWidth / 2 - nameWidth / 2 - 20, 285)
      .lineTo(pageWidth / 2 + nameWidth / 2 + 20, 285)
      .lineWidth(1)
      .stroke("#4f46e5");

    // Completion text
    doc
      .fontSize(13)
      .fillColor("#cbd5e1")
      .font("Helvetica")
      .text("for successfully completing the course", 0, 305, {
        align: "center",
      });

    doc
      .fontSize(22)
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .text(courseTitle, 0, 330, { align: "center", width: pageWidth });

    // Footer: date + signature line
    const footerY = pageHeight - 110;
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc
      .fontSize(11)
      .fillColor("#94a3b8")
      .font("Helvetica")
      .text(`Date of Completion: ${today}`, 90, footerY, { width: 250 });

    doc
      .moveTo(pageWidth - 340, footerY + 25)
      .lineTo(pageWidth - 90, footerY + 25)
      .lineWidth(1)
      .stroke("#6366f1");

    doc
      .fontSize(12)
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .text("Nova", pageWidth - 340, footerY - 5, {
        width: 250,
        align: "center",
      });

    doc
      .fontSize(10)
      .fillColor("#94a3b8")
      .font("Helvetica")
      .text("AI Tutor — Authorized Signature", pageWidth - 340, footerY + 30, {
        width: 250,
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate certificate" });
  }
}
