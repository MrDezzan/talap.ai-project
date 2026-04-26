import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, SectionType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export async function generateCV(data) {
  if (!data) return;

  const doc = new Document({
    sections: [{
      properties: {
        type: SectionType.CONTINUOUS,
        page: {
          margin: {
            top: 720,
            right: 720,
            bottom: 720,
            left: 720,
          },
        },
      },
      children: [
        // Header: Name
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: (data.name || 'Student Name').toUpperCase(),
              bold: true,
              size: 28,
              font: 'Calibri',
            }),
          ],
        }),
        // Contact info
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: data.contact || `${data.email || ''} | ${data.phone || ''} | ${data.city || ''}`,
              size: 18,
              font: 'Calibri',
            }),
          ],
          spacing: { after: 100 },
        }),
        // Tagline
        ...(data.tagline ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.tagline,
                bold: true,
                size: 20,
                font: 'Calibri',
                color: '444444',
              }),
            ],
            spacing: { after: 300 },
          })
        ] : []),

        // Professional Experience
        ...(data.experience && data.experience.length > 0 ? [
          new Paragraph({
            text: 'PROFESSIONAL EXPERIENCE / PROJECTS',
            heading: HeadingLevel.HEADING_2,
            border: {
              bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { before: 200, after: 100 },
          }),
          ...data.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.company || 'Project', bold: true, size: 20 }),
                new TextRun({ text: ` | ${exp.role}`, italics: true, size: 20 }),
                new TextRun({ text: ` (${exp.period})`, color: '666666', size: 18 }),
              ],
              spacing: { before: 150 },
            }),
            ...(exp.description ? [
              new Paragraph({
                children: [new TextRun({ text: exp.description, size: 18 })],
                spacing: { before: 50 },
              })
            ] : []),
            ...(exp.achievements ? exp.achievements.map(ach => new Paragraph({
              children: [new TextRun({ text: `• ${ach}`, size: 18 })],
              indent: { left: 360 },
              spacing: { before: 50 },
            })) : []),
            ...(exp.stack ? [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Stack: ', bold: true, size: 18 }),
                  new TextRun({ text: exp.stack, size: 18 }),
                ],
                spacing: { before: 50, after: 100 },
              })
            ] : []),
          ])
        ] : []),

        // Achievements Section
        ...(data.achievements_list && data.achievements_list.length > 0 ? [
          new Paragraph({
            text: 'ACHIEVEMENTS',
            heading: HeadingLevel.HEADING_2,
            border: {
              bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { before: 250, after: 100 },
          }),
          ...data.achievements_list.map(ach => new Paragraph({
            children: [new TextRun({ text: `• ${ach}`, size: 18 })],
            spacing: { before: 50 },
          }))
        ] : []),

        // Education
        ...(data.education && data.education.length > 0 ? [
          new Paragraph({
            text: 'EDUCATION',
            heading: HeadingLevel.HEADING_2,
            border: {
              bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { before: 250, after: 100 },
          }),
          ...data.education.map(edu => new Paragraph({
            children: [
              new TextRun({ text: edu.school, bold: true, size: 20 }),
              new TextRun({ text: ` | ${edu.degree || ''}`, size: 18 }),
              new TextRun({ text: ` (${edu.period})`, color: '666666', size: 18 }),
            ],
            spacing: { before: 100 },
          }))
        ] : []),

        // Skills
        ...(data.skills && data.skills.length > 0 ? [
          new Paragraph({
            text: 'SKILLS',
            heading: HeadingLevel.HEADING_2,
            border: {
              bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { before: 250, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
                size: 18,
              })
            ],
            spacing: { before: 50 },
          })
        ] : []),

        // Languages & Hobbies
        ...((data.languages || data.hobbies) ? [
          new Paragraph({
            text: 'LANGUAGES & HOBBIES',
            heading: HeadingLevel.HEADING_2,
            border: {
              bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { before: 250, after: 100 },
          }),
          ...(data.languages ? [
            new Paragraph({
              children: [
                new TextRun({ text: 'Languages: ', bold: true, size: 18 }),
                new TextRun({ text: data.languages, size: 18 }),
              ],
            })
          ] : []),
          ...(data.hobbies ? [
            new Paragraph({
              children: [
                new TextRun({ text: 'Hobbies: ', bold: true, size: 18 }),
                new TextRun({ text: data.hobbies, size: 18 }),
              ],
            })
          ] : []),
        ] : []),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `CV_${data.name?.replace(/\s/g, '_') || 'Talap'}.docx`);
}
