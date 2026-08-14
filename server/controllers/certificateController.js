import PDFDocument from "pdfkit";

export function generateCertificate(req, res) {
  try {
    const { studentName, courseTitle } = req.body;

    if (!studentName || !courseTitle) {
      return res.status(400).json({ error: "studentName and courseTitle are required" });
    }

    const doc = new PDFDocument({ layout: "landscape", size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");

    doc.pipe(res);
    doc.fontSize(28).text("Certificate of Completion", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(20).text("This certifies that", { align: "center" });
    doc.fontSize(26).text(studentName, { align: "center" });
    doc.fontSize(20).text("has successfully completed", { align: "center" });
    doc.fontSize(24).text(courseTitle, { align: "center" });
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate certificate" });
  }
}
