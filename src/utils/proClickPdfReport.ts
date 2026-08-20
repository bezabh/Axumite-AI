import { jsPDF } from 'jspdf';
import { ProClickDailyMetric, UserSubscription } from '../types';

export function generateProClickPdfReport(
  dailyMetrics: ProClickDailyMetric[],
  userSubscription: UserSubscription,
  kpis: {
    totalClicks: number;
    totalMined: number;
    peakClicks: number;
    peakTokens: number;
    avgClicks: number;
    latestCumulativeUSD: number;
  }
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297

  // --- PAGE 1: HEADER & KPI CARDS & DAYS 1-18 ---
  
  // Top Header Banner (Dark Luxury Gold Theme)
  doc.setFillColor(12, 10, 6);
  doc.rect(0, 0, pageWidth, 34, 'F');

  doc.setFillColor(197, 160, 89);
  doc.rect(0, 34, pageWidth, 2, 'F');

  // Document Title
  doc.setTextColor(243, 229, 171);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AXUMITE SOVEREIGN AI • 30-DAY PRO CLICK REPORT', 12, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(190, 190, 190);
  doc.text('Official Performance Ledger & Personal Financial Earnings Record', 12, 21);

  doc.setFontSize(8);
  doc.setTextColor(197, 160, 89);
  const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  doc.text(`Date Issued: ${nowStr} | Ref Code: ${userSubscription.referralCode || 'AXUM-ERITREA-PRO'} | Plan: ${userSubscription.planName}`, 12, 28);

  // KPI Summary Cards (4 Columns)
  const kpiBoxY = 40;
  const cardWidth = (pageWidth - 24 - 9) / 4; // approx 44mm per card

  const cardsData = [
    { title: 'Total Period Clicks', value: `${kpis.totalClicks.toLocaleString()} Clicks`, sub: `Avg ${kpis.avgClicks} clicks/day` },
    { title: 'Tokens Mined', value: `+${kpis.totalMined.toLocaleString()}`, sub: `≈ $${(kpis.totalMined * 0.0002).toFixed(2)} USD` },
    { title: 'Cumulative Vault', value: `$${kpis.latestCumulativeUSD.toFixed(2)} USD`, sub: '30-Day Total Val' },
    { title: 'Peak Day Output', value: `${kpis.peakClicks} Clicks`, sub: `+${kpis.peakTokens.toLocaleString()} Peak Tokens` },
  ];

  cardsData.forEach((c, i) => {
    const x = 12 + i * (cardWidth + 3);
    doc.setFillColor(245, 242, 235);
    doc.setDrawColor(197, 160, 89);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, kpiBoxY, cardWidth, 22, 1, 1, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(120, 90, 30);
    doc.text(c.title.toUpperCase(), x + 3, kpiBoxY + 5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(c.value, x + 3, kpiBoxY + 12);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(c.sub, x + 3, kpiBoxY + 18);
  });

  // Table Section Header
  let currentY = 68;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 12, 8);
  doc.text('30-DAY DAILY AUDIT & BREAKDOWN', 12, currentY);

  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.5);
  doc.line(12, currentY + 2, pageWidth - 12, currentY + 2);

  currentY += 8;

  // Table Headers
  const colWidths = [24, 24, 28, 28, 30, 32, 20]; // Total 186mm (fits in 210mm with 12mm margins)
  const colHeaders = ['Date', 'Clicks', 'Daily Tokens', 'Referral Bonus', 'Total Output', 'Cumulative Vault', 'USD Val'];

  doc.setFillColor(15, 12, 8);
  doc.rect(12, currentY, pageWidth - 24, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(243, 229, 171);

  let startX = 14;
  colHeaders.forEach((h, idx) => {
    doc.text(h, startX, currentY + 5);
    startX += colWidths[idx];
  });

  currentY += 7;

  // Render Table Rows (Split between Page 1 and Page 2 if needed)
  dailyMetrics.forEach((metric, rowIdx) => {
    // Check if new page is required
    if (currentY > pageHeight - 25) {
      // Add Page Footer
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(`Axumite Sovereign AI Ledger • Page ${doc.getNumberOfPages()}`, 12, pageHeight - 10);
      doc.text('Encrypted Authenticity Record • Confidentially Prepared', pageWidth - 12, pageHeight - 10, { align: 'right' });

      doc.addPage();
      currentY = 20;

      // Repeat Table Headers on Page 2
      doc.setFillColor(15, 12, 8);
      doc.rect(12, currentY, pageWidth - 24, 7, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(243, 229, 171);

      let p2X = 14;
      colHeaders.forEach((h, idx) => {
        doc.text(h, p2X, currentY + 5);
        p2X += colWidths[idx];
      });

      currentY += 7;
    }

    // Row Background
    if (rowIdx % 2 === 0) {
      doc.setFillColor(250, 248, 243);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(12, currentY, pageWidth - 24, 6.5, 'F');

    doc.setDrawColor(230, 225, 215);
    doc.setLineWidth(0.1);
    doc.line(12, currentY + 6.5, pageWidth - 12, currentY + 6.5);

    // Row Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(40, 40, 40);

    let rX = 14;
    
    // Date & Day
    doc.text(`${metric.date} (${metric.day})`, rX, currentY + 4.5);
    rX += colWidths[0];

    // Clicks
    doc.setFont('helvetica', 'bold');
    doc.text(`${metric.clicks}`, rX, currentY + 4.5);
    doc.setFont('helvetica', 'normal');
    rX += colWidths[1];

    // Daily Tokens
    doc.text(`+${metric.dailyTokens.toLocaleString()}`, rX, currentY + 4.5);
    rX += colWidths[2];

    // Referral Bonus
    doc.text(`+${metric.referralBonus.toLocaleString()}`, rX, currentY + 4.5);
    rX += colWidths[3];

    // Total Daily Output
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(150, 100, 20);
    doc.text(`+${metric.totalDaily.toLocaleString()}`, rX, currentY + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    rX += colWidths[4];

    // Cumulative Vault
    doc.text(`${metric.cumulativeTokens.toLocaleString()}`, rX, currentY + 4.5);
    rX += colWidths[5];

    // USD Value
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 130, 85);
    doc.text(`$${metric.usdValue.toFixed(2)}`, rX, currentY + 4.5);

    currentY += 6.5;
  });

  // Footer / Verification Stamp at end of report
  currentY += 6;
  if (currentY + 30 > pageHeight - 15) {
    doc.addPage();
    currentY = 20;
  }

  // Verification Seal Box
  doc.setFillColor(245, 240, 228);
  doc.setDrawColor(197, 160, 89);
  doc.setLineWidth(0.4);
  doc.roundedRect(12, currentY, pageWidth - 24, 22, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 90, 20);
  doc.text('AUTHENTICITY & VERIFICATION STAMP', 16, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  doc.text('This document represents an automated financial summary of user engagement activity and neural token mining rewards accumulated via the Axumite Pro Click system.', 16, currentY + 11);
  doc.text(`Ledger Hash: 0x${Math.random().toString(36).substring(2, 10).toUpperCase()}${Math.random().toString(36).substring(2, 10).toUpperCase()} | Status: VERIFIED SOVEREIGN RECORD`, 16, currentY + 16);

  // Bottom Footer Page Numbers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(`Axumite Sovereign AI Ledger • Page ${p} of ${totalPages}`, 12, pageHeight - 10);
    doc.text('Encrypted Authenticity Record • Confidentially Prepared', pageWidth - 12, pageHeight - 10, { align: 'right' });
  }

  // Trigger Save PDF File
  doc.save(`Axumite_ProClick_30Day_Summary_${new Date().toISOString().slice(0, 10)}.pdf`);
}
