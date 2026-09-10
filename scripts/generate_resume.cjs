const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

async function createResume() {
  const pdfDoc = await PDFDocument.create();
  
  // Standard US Letter dimensions (612 x 792 pt)
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();
  
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const leftMargin = 48;
  const rightMargin = width - 48;
  const contentWidth = rightMargin - leftMargin;

  let y = height - 42;

  // Helper to draw horizontal line
  const drawSeparator = (currentY) => {
    page.drawLine({
      start: { x: leftMargin, y: currentY },
      end: { x: rightMargin, y: currentY },
      thickness: 0.75,
      color: rgb(0.1, 0.1, 0.1),
    });
  };

  // Helper to draw centered section header
  const drawSectionHeader = (title) => {
    y -= 14;
    const textWidth = fontBold.widthOfTextAtSize(title, 10.5);
    page.drawText(title, {
      x: (width - textWidth) / 2,
      y,
      size: 10.5,
      font: fontBold,
      color: rgb(0.05, 0.05, 0.05),
    });
    y -= 5;
    drawSeparator(y);
    y -= 12;
  };

  // Helper for multi-line text wrapping
  const drawWrappedText = (text, startX, maxWidth, size = 8.5, font = fontRegular, lineHeight = 11.5) => {
    const words = text.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
      const testWidth = font.widthOfTextAtSize(testLine, size);

      if (testWidth > maxWidth && currentLine) {
        page.drawText(currentLine, {
          x: startX,
          y,
          size,
          font,
          color: rgb(0.15, 0.15, 0.15),
        });
        y -= lineHeight;
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      page.drawText(currentLine, {
        x: startX,
        y,
        size,
        font,
        color: rgb(0.15, 0.15, 0.15),
      });
      y -= lineHeight;
    }
  };

  // ==================== 1. TOP HEADER ====================
  // Left side: SIKANDAR & GitHub
  page.drawText('SIKANDAR', {
    x: leftMargin,
    y: y,
    size: 18,
    font: fontBold,
    color: rgb(0.05, 0.05, 0.05),
  });

  // Right side: Email
  const emailText = 'Email: sikandarswami@91gmail.com';
  const emailWidth = fontRegular.widthOfTextAtSize(emailText, 9);
  page.drawText(emailText, {
    x: rightMargin - emailWidth,
    y: y + 5,
    size: 9,
    font: fontRegular,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Right side: Mobile
  const mobileText = 'Mobile: +91 9198431459';
  const mobileWidth = fontRegular.widthOfTextAtSize(mobileText, 9);
  page.drawText(mobileText, {
    x: rightMargin - mobileWidth,
    y: y - 10,
    size: 9,
    font: fontRegular,
    color: rgb(0.15, 0.15, 0.15),
  });

  // Left side: Github
  y -= 18;
  page.drawText('Github: ', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.15, 0.15, 0.15),
  });
  page.drawText('sikandarswami91-max', {
    x: leftMargin + fontBold.widthOfTextAtSize('Github: ', 9),
    y,
    size: 9,
    font: fontRegular,
    color: rgb(0.1, 0.35, 0.7),
  });

  y -= 8;
  drawSeparator(y);

  // ==================== 2. EDUCATION ====================
  drawSectionHeader('EDUCATION');

  // University & Location
  page.drawText('Maharishi University Of Information Technology', {
    x: leftMargin,
    y,
    size: 9.5,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  const locText = 'Lucknow, India';
  page.drawText(locText, {
    x: rightMargin - fontRegular.widthOfTextAtSize(locText, 9.5),
    y,
    size: 9.5,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 13;
  // Degree & Duration
  page.drawText('Bachelor of Computer Application – Software Engineer', {
    x: leftMargin,
    y,
    size: 9,
    font: fontOblique,
    color: rgb(0.2, 0.2, 0.2),
  });
  const dateText = 'September 2023 – 2026';
  page.drawText(dateText, {
    x: rightMargin - fontRegular.widthOfTextAtSize(dateText, 9),
    y,
    size: 9,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.2),
  });

  y -= 6;
  drawSeparator(y);

  // ==================== 3. SKILLS SUMMARY ====================
  drawSectionHeader('SKILLS SUMMARY');

  const skills = [
    { label: 'Languages: ', val: 'JavaScript, Typescript, HTML5, CSS3, SQL,' },
    { label: 'Frontend: ', val: 'React.js, Tailwind CSS' },
    { label: 'Backend: ', val: 'Node.js, Express.js, REST APIs, JWT Authentication' },
    { label: 'Database: ', val: 'Mongo DB, MySQL,' },
    { label: 'Tools & Platforms: ', val: 'Git, GitHub, VS Code, IntelliJ IDEA, Postman, Mongo DB Compass' },
  ];

  const drawHollowBullet = (bx, by) => {
    page.drawCircle({
      x: bx,
      y: by + 2.5,
      size: 2,
      borderColor: rgb(0.2, 0.2, 0.2),
      borderWidth: 0.8,
    });
  };

  const drawFilledBullet = (bx, by) => {
    page.drawCircle({
      x: bx,
      y: by + 2.5,
      size: 1.8,
      color: rgb(0.1, 0.1, 0.1),
    });
  };

  for (const s of skills) {
    drawFilledBullet(leftMargin + 8, y);
    page.drawText(s.label, {
      x: leftMargin + 18,
      y,
      size: 8.5,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(s.val, {
      x: leftMargin + 18 + fontBold.widthOfTextAtSize(s.label, 8.5),
      y,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 13;
  }

  y -= 2;
  drawSeparator(y);

  // ==================== 4. WORK EXPERIENCE ====================
  drawSectionHeader('WORK EXPERIENCE');

  page.drawText('FRESHER', {
    x: leftMargin,
    y,
    size: 9.5,
    font: fontBold,
    color: rgb(0.05, 0.05, 0.05),
  });
  y -= 15;

  page.drawText('FRONTEND DEVELOPER INTERN | (Code Alfa) | Virtual', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  const expDuration = 'January 25- June 25';
  page.drawText(expDuration, {
    x: rightMargin - fontRegular.widthOfTextAtSize(expDuration, 9),
    y,
    size: 9,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 13;

  const expBullets = [
    'Developed and optimized responsive user interfaces using React.js and Tailwind CSS, enhancing user experience across Collaborated with backend teams to integrate RESTful APIs and ensure seamless data flow.',
    'Participated in agile sprints, contributing to code reviews, daily stand-ups, and project planning.',
    'Built reusable UI components improving development efficiency by 25%.',
    'Implemented process improvements and automation solutions, resulting in 15% increase in productivity.',
    'Utilized Git and GitHub for version control and teamwork in a remote setup.',
  ];

  for (const b of expBullets) {
    drawHollowBullet(leftMargin + 14, y);
    drawWrappedText(b, leftMargin + 24, contentWidth - 24, 8.25, fontRegular, 11);
    y -= 2;
  }

  y -= 2;
  drawSeparator(y);

  // ==================== 5. PROJECTS ====================
  drawSectionHeader('PROJECTS');

  // Studio99 Salon
  page.drawText('Studio99 Salon:', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 12;
  drawWrappedText(
    'Designed and developed a responsive salon website using React.js and Tailwind CSS, featuring service sections, bridal packages, image/video gallery, responsive navigation, and interactive UI components. Focused on clean design, mobile responsiveness, reusable components, and smooth user experience.',
    leftMargin,
    contentWidth,
    8.25,
    fontRegular,
    11
  );

  y -= 4;

  // MegaBasket
  page.drawText('MegaBasket:', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 12;
  drawWrappedText(
    'Developed a secure and responsive full-stack e-commerce platform with role-based access for Admin and Customers. Implemented JWT-based authentication, MongoDB database integration, product and inventory management, shopping cart, wishlist, and order tracking. Built a modern admin dashboard for managing products, users, and orders, with a fast, user-friendly interface using React.js, Node.js, Express.js, and MongoDB.',
    leftMargin,
    contentWidth,
    8.25,
    fontRegular,
    11
  );

  y -= 2;
  drawSeparator(y);

  // ==================== 6. CERTIFICATES ====================
  drawSectionHeader('CERTIFICATES');

  page.drawText('Web Development (Infosys) | CERTIFICATE', {
    x: leftMargin,
    y,
    size: 9,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  });
  const certDate = 'March 2024';
  page.drawText(certDate, {
    x: rightMargin - fontRegular.widthOfTextAtSize(certDate, 9),
    y,
    size: 9,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 13;

  const certBullets = [
    'Gained core web technologies, including MONGODB, NODEJS, and JavaScript, for building responsive and interactive',
    'Developed expertise in front-end and back-end web development, applying DOM manipulation, event',
  ];

  for (const cb of certBullets) {
    drawHollowBullet(leftMargin + 14, y);
    drawWrappedText(cb, leftMargin + 24, contentWidth - 24, 8.25, fontRegular, 11);
    y -= 1;
  }

  // Save PDF bytes with standard object streams disabled for maximum compatibility
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  const rawPath = path.join(process.cwd(), 'public', 'resume_raw.pdf');
  fs.writeFileSync(rawPath, pdfBytes);

  // Use Ghostscript to compile to standard PDF 1.4 with all fonts embedded
  const { execSync } = require('child_process');
  const prepressPdfPath = path.join(process.cwd(), 'public', 'resume.pdf');
  try {
    execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/prepress -sOutputFile="${prepressPdfPath}" "${rawPath}"`);
    console.log('✅ Generated PDF 1.4 with embedded fonts via Ghostscript');
    // Generate high-res preview image for seamless visual document rendering in iframes & browsers
    const previewPngPath = path.join(process.cwd(), 'public', 'resume-preview.png');
    execSync(`gs -dNOPAUSE -dBATCH -sDEVICE=png16m -o "${previewPngPath}" -r200 "${prepressPdfPath}"`);
    console.log('✅ Generated high-resolution resume preview image');
  } catch (gsErr) {
    console.warn('Ghostscript processing warning:', gsErr.message);
    fs.writeFileSync(prepressPdfPath, pdfBytes);
  }

  // Synchronize with frontend and dist directories
  const finalPdf = fs.readFileSync(prepressPdfPath);
  const targetPdfPaths = [
    path.join(process.cwd(), 'frontend', 'public', 'resume.pdf'),
    path.join(process.cwd(), 'dist', 'resume.pdf'),
  ];
  for (const t of targetPdfPaths) {
    const dir = path.dirname(t);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(t, finalPdf);
  }

  const previewSrc = path.join(process.cwd(), 'public', 'resume-preview.png');
  if (fs.existsSync(previewSrc)) {
    const previewData = fs.readFileSync(previewSrc);
    for (const d of ['frontend/public', 'dist']) {
      const dest = path.join(process.cwd(), d, 'resume-preview.png');
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(dest, previewData);
    }
  }

  if (fs.existsSync(rawPath)) {
    try { fs.unlinkSync(rawPath); } catch (_) {}
  }
}

createResume().catch((err) => {
  console.error('Error generating original resume:', err);
  process.exit(1);
});
