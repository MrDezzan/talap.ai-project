import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, SectionType } from 'docx';
import { saveAs } from 'file-saver';

export async function generateCV(data) {
  if (!data) return;

  const doc = new Document({
    sections: [{
      properties: {
        type: SectionType.CONTINUOUS,
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.name || 'Student Name',
              bold: true,
              size: 32,
              font: 'Calibri',
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${data.email || ''} | ${data.phone || ''} | ${data.city || ''}`,
              size: 20,
              font: 'Calibri',
            }),
          ],
          spacing: { after: 400 },
        }),

        ...(data.summary ? [
          new Paragraph({
            text: 'ОБЩАЯ ИНФОРМАЦИЯ',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: data.summary,
            spacing: { after: 200 },
          }),
        ] : []),

        ...(data.experience ? [
          new Paragraph({
            text: 'ОПЫТ РАБОТЫ И ПРОЕКТЫ',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.experience.map(exp => new Paragraph({
            children: [
              new TextRun({ text: exp.title, bold: true }),
              new TextRun({ text: ` | ${exp.company || exp.location}`, italics: true }),
              new TextRun({ text: ` (${exp.period})`, color: '666666' }),
              new TextRun({ text: `\n${exp.description}`, break: 1 }),
            ],
            spacing: { after: 200 },
          }))
        ] : []),

        ...(data.education ? [
          new Paragraph({
            text: 'ОБРАЗОВАНИЕ',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.education.map(edu => new Paragraph({
            children: [
              new TextRun({ text: edu.school, bold: true }),
              new TextRun({ text: ` (${edu.period})`, color: '666666' }),
              new TextRun({ text: `\n${edu.degree || ''}`, break: 1 }),
            ],
            spacing: { after: 200 },
          }))
        ] : []),

        ...(data.skills ? [
          new Paragraph({
            text: 'НАВЫКИ',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
            spacing: { after: 200 },
          }),
        ] : []),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `CV_${data.name?.replace(/\s/g, '_') || 'Talap'}.docx`);
}
