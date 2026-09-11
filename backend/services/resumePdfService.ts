import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';
import {
  PERSONAL_INFO,
  SKILLS,
  EXPERIENCE,
  EDUCATION,
  PROJECTS,
} from '../../frontend/src/data/portfolioData';

/**
 * Dynamic, professional resume PDF generator (A4, multi-page safe).
 *
 * Uses pdf-lib (already a project dependency) to build a genuine PDF from
 * the same portfolio data shown on the public site, so the download is
 * always up to date and never falls back to an HTML/JSON error response.
 */

// A4 page size in points
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;
const BOTTOM_MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLOR_TEXT = rgb(0.13, 0.13, 0.13);
const COLOR_MUTED = rgb(0.33, 0.33, 0.33);
const COLOR_ACCENT = rgb(0.06, 0.4, 0.65);
const COLOR_NAME = rgb(0.04, 0.04, 0.04);

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
  oblique: PDFFont;
}

class ResumeComposer {
  private doc!: PDFDocument;
  private page!: PDFPage;
  private y = 0;
  private fonts!: Fonts;

  private async init() {
    this.doc = await PDFDocument.create();
    this.doc.setTitle('Sikandar_Bharti_Resume');
    this.doc.setAuthor('Sikandar Bharti');
    this.doc.setSubject('Resume — Full Stack / MERN Developer');
    this.doc.setCreator('Sikandar Portfolio');
    this.fonts = {
      regular: await this.doc.embedFont(StandardFonts.Helvetica),
      bold: await this.doc.embedFont(StandardFonts.HelveticaBold),
      oblique: await this.doc.embedFont(StandardFonts.HelveticaOblique),
    };
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  /** Add a new page when remaining space is insufficient (prevents clipping/overlap). */
  private ensureSpace(needed: number) {
    if (this.y - needed < BOTTOM_MARGIN) {
      this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      this.y = PAGE_HEIGHT - MARGIN;
    }
  }

  private separator() {
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y },
      thickness: 0.8,
      color: rgb(0.55, 0.55, 0.55),
    });
  }

  private sectionHeader(title: string) {
    this.ensureSpace(42);
    this.y -= 16;
    const size = 11;
    this.page.drawText(title, {
      x: MARGIN,
      y: this.y,
      size,
      font: this.fonts.bold,
      color: COLOR_ACCENT,
    });
    const tw = this.fonts.bold.widthOfTextAtSize(title, size);
    this.page.drawLine({
      start: { x: MARGIN + tw + 8, y: this.y + 3.5 },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y + 3.5 },
      thickness: 0.6,
      color: rgb(0.8, 0.8, 0.8),
    });
    this.y -= 14;
  }

  private wrap(text: string, maxWidth: number, size: number, font: PDFFont): string[] {
    const words = text.replace(/\s+/g, ' ').trim().split(' ');
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  private drawParagraph(
    text: string,
    opts: {
      size?: number;
      font?: PDFFont;
      color?: ReturnType<typeof rgb>;
      indent?: number;
      width?: number;
      lineHeight?: number;
    } = {}
  ) {
    const size = opts.size ?? 9.5;
    const font = opts.font ?? this.fonts.regular;
    const indent = opts.indent ?? 0;
    const lineHeight = opts.lineHeight ?? size + 3.5;
    const maxWidth = opts.width ?? CONTENT_WIDTH - indent;
    for (const line of this.wrap(text, maxWidth, size, font)) {
      this.ensureSpace(lineHeight);
      this.page.drawText(line, {
        x: MARGIN + indent,
        y: this.y,
        size,
        font,
        color: opts.color ?? COLOR_TEXT,
      });
      this.y -= lineHeight;
    }
  }

  private drawBullets(items: string[], size = 9.5) {
    const lineHeight = size + 3.5;
    for (const item of items) {
      const lines = this.wrap(item, CONTENT_WIDTH - 16, size, this.fonts.regular);
      this.ensureSpace(lines.length * lineHeight + 2);
      this.page.drawCircle({
        x: MARGIN + 4,
        y: this.y + size * 0.32,
        size: 1.7,
        color: COLOR_ACCENT,
      });
      for (const line of lines) {
        this.page.drawText(line, {
          x: MARGIN + 16,
          y: this.y,
          size,
          font: this.fonts.regular,
          color: COLOR_TEXT,
        });
        this.y -= lineHeight;
      }
      this.y -= 2.5;
    }
  }

  private drawKeyValueLine(label: string, value: string, size = 9.5) {
    const lineHeight = size + 3.5;
    const labelWidth = this.fonts.bold.widthOfTextAtSize(label, size);
    const total = labelWidth + this.fonts.regular.widthOfTextAtSize(value, size);
    const lines =
      total <= CONTENT_WIDTH - 16
        ? [value]
        : this.wrap(value, CONTENT_WIDTH - 16, size, this.fonts.regular);
    this.ensureSpace(lines.length * lineHeight + 2);
    this.page.drawCircle({
      x: MARGIN + 4,
      y: this.y + size * 0.32,
      size: 1.7,
      color: COLOR_ACCENT,
    });
    this.page.drawText(label, {
      x: MARGIN + 16,
      y: this.y,
      size,
      font: this.fonts.bold,
      color: COLOR_TEXT,
    });
    this.page.drawText(lines[0], {
      x: MARGIN + 16 + labelWidth,
      y: this.y,
      size,
      font: this.fonts.regular,
      color: COLOR_MUTED,
    });
    this.y -= lineHeight;
    for (const line of lines.slice(1)) {
      this.ensureSpace(lineHeight);
      this.page.drawText(line, {
        x: MARGIN + 16,
        y: this.y,
        size,
        font: this.fonts.regular,
        color: COLOR_MUTED,
      });
      this.y -= lineHeight;
    }
    this.y -= 2;
  }

  // ============ Sections ============

  private drawHeader() {
    const name = 'SIKANDAR BHARTI';
    const nameSize = 21;
    const nameWidth = this.fonts.bold.widthOfTextAtSize(name, nameSize);
    this.ensureSpace(90);
    this.page.drawText(name, {
      x: (PAGE_WIDTH - nameWidth) / 2,
      y: this.y,
      size: nameSize,
      font: this.fonts.bold,
      color: COLOR_NAME,
    });
    this.y -= 16;

    const title = `${PERSONAL_INFO.title}  |  ${PERSONAL_INFO.subtitle}`;
    const tSize = 10.5;
    const tw = this.fonts.oblique.widthOfTextAtSize(title, tSize);
    this.page.drawText(title, {
      x: (PAGE_WIDTH - tw) / 2,
      y: this.y,
      size: tSize,
      font: this.fonts.oblique,
      color: COLOR_ACCENT,
    });
    this.y -= 15;

    const contact = `${PERSONAL_INFO.email}  |  ${PERSONAL_INFO.phone}  |  ${PERSONAL_INFO.location}`;
    const cSize = 9;
    for (const line of this.wrap(contact, CONTENT_WIDTH, cSize, this.fonts.regular)) {
      const lw = this.fonts.regular.widthOfTextAtSize(line, cSize);
      this.page.drawText(line, {
        x: (PAGE_WIDTH - lw) / 2,
        y: this.y,
        size: cSize,
        font: this.fonts.regular,
        color: COLOR_MUTED,
      });
      this.y -= 12;
    }

    const links = `GitHub: ${PERSONAL_INFO.github.replace('https://', '')}  |  LinkedIn: ${PERSONAL_INFO.linkedin.replace('https://', '')}`;
    for (const line of this.wrap(links, CONTENT_WIDTH, cSize, this.fonts.regular)) {
      const lw = this.fonts.regular.widthOfTextAtSize(line, cSize);
      this.page.drawText(line, {
        x: (PAGE_WIDTH - lw) / 2,
        y: this.y,
        size: cSize,
        font: this.fonts.regular,
        color: COLOR_ACCENT,
      });
      this.y -= 12;
    }

    this.y -= 4;
    this.separator();
    this.y -= 8;
  }

  private drawSummary() {
    this.sectionHeader('PROFESSIONAL SUMMARY');
    this.drawParagraph(PERSONAL_INFO.bio, { size: 9.5 });
    this.y -= 6;
  }

  private drawSkills() {
    this.sectionHeader('TECHNICAL SKILLS');
    const groups = new Map<string, string[]>();
    for (const s of SKILLS) {
      const list = groups.get(s.category) ?? [];
      list.push(s.name);
      groups.set(s.category, list);
    }
    for (const [category, items] of groups) {
      this.drawKeyValueLine(`${category}: `, items.join(', '));
    }
    this.y -= 6;
  }

  private drawExperience() {
    this.sectionHeader('WORK EXPERIENCE');
    for (const exp of EXPERIENCE) {
      this.ensureSpace(40);
      this.page.drawText(exp.company, {
        x: MARGIN,
        y: this.y,
        size: 10.5,
        font: this.fonts.bold,
        color: COLOR_TEXT,
      });
      const meta = [exp.duration, exp.location].filter(Boolean).join('  |  ');
      const mw = this.fonts.regular.widthOfTextAtSize(meta, 9);
      this.page.drawText(meta, {
        x: PAGE_WIDTH - MARGIN - mw,
        y: this.y,
        size: 9,
        font: this.fonts.regular,
        color: COLOR_MUTED,
      });
      this.y -= 14;
      this.drawParagraph(exp.role, { size: 10, font: this.fonts.bold, color: COLOR_ACCENT });
      this.y -= 2;
      this.drawParagraph(exp.description, { size: 9.5 });
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        this.y -= 2;
        this.drawParagraph('Key Contributions & Responsibilities:', {
          size: 9.5,
          font: this.fonts.bold,
          color: COLOR_TEXT,
        });
        this.y -= 3;
        this.drawBullets(exp.responsibilities);
      }
      if (exp.skills && exp.skills.length > 0) {
        this.y -= 2;
        this.drawKeyValueLine('Technologies: ', exp.skills.join(' · '));
      }
      this.y -= 6;
    }
  }

  private drawProjects() {
    this.sectionHeader('PROJECTS');
    for (const project of PROJECTS) {
      this.ensureSpace(48);
      this.page.drawText(project.title, {
        x: MARGIN,
        y: this.y,
        size: 10,
        font: this.fonts.bold,
        color: COLOR_TEXT,
      });
      this.y -= 13;
      this.drawParagraph(
        `${project.technologies.join(', ')} — ${project.longDescription || project.description}`,
        { size: 9.25, color: COLOR_TEXT }
      );
      this.y -= 5;
    }
  }

  private drawEducation() {
    this.sectionHeader('EDUCATION');
    for (const edu of EDUCATION) {
      this.ensureSpace(48);
      this.page.drawText(edu.institution, {
        x: MARGIN,
        y: this.y,
        size: 10.5,
        font: this.fonts.bold,
        color: COLOR_TEXT,
      });
      const meta = [edu.location, edu.period, edu.duration].filter(Boolean).join('  |  ');
      if (meta) {
        const mw = this.fonts.regular.widthOfTextAtSize(meta, 9);
        this.page.drawText(meta, {
          x: PAGE_WIDTH - MARGIN - mw,
          y: this.y,
          size: 9,
          font: this.fonts.regular,
          color: COLOR_MUTED,
        });
      }
      this.y -= 14;
      const degree = [edu.degree, edu.status].filter(Boolean).join(' — ');
      this.drawParagraph(degree, { size: 9.75, font: this.fonts.oblique, color: COLOR_MUTED });
      if (edu.description) {
        this.y -= 1;
        this.drawParagraph(edu.description, { size: 9.25 });
      }
      if (edu.highlights && edu.highlights.length > 0) {
        this.y -= 2;
        this.drawBullets(edu.highlights, 9.25);
      }
      this.y -= 4;
    }
  }

  private drawCertificates() {
    this.sectionHeader('CERTIFICATIONS');
    this.drawBullets([
      'Web Development Certification — Infosys (March 2024): MongoDB, Node.js, JavaScript, and responsive web development.',
      'Full Stack Web Development — hands-on training covering React.js, Express.js, REST APIs, and MongoDB CRUD operations.',
    ]);
  }

  async generate(): Promise<Uint8Array> {
    await this.init();
    this.drawHeader();
    this.drawSummary();
    this.drawSkills();
    this.drawExperience();
    this.drawProjects();
    this.drawEducation();
    this.drawCertificates();
    return this.doc.save({ useObjectStreams: false });
  }
}

export async function generateResumePdf(): Promise<Uint8Array> {
  const composer = new ResumeComposer();
  return composer.generate();
}
