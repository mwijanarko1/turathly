"use node";

import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  WidthType,
} from "docx";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

export const exportDocument = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const documentRecord = await ctx.runQuery(api.documents.getById, { id: args.documentId });
    if (!documentRecord) {
      throw new Error("Document not found");
    }

    const segments = await ctx.runQuery(api.segments.listByDocument, {
      documentId: args.documentId,
    });
    const translations = await ctx.runQuery(api.translations.listByDocument, {
      documentId: args.documentId,
    });

    const translationMap = new Map(
      translations.map((entry) => [entry.segmentId, entry.translation?.translation ?? ""])
    );

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "Arabic", alignment: AlignmentType.RIGHT })],
            }),
            new TableCell({
              width: { size: 50, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ text: "English", alignment: AlignmentType.LEFT })],
            }),
          ],
        }),
        ...segments.map(
          (segment) =>
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      text: segment.text,
                      alignment: AlignmentType.RIGHT,
                      bidirectional: true,
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      text: translationMap.get(segment._id) || "",
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
              ],
            })
        ),
      ],
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: documentRecord.title || "Turathly Export",
              spacing: { after: 240 },
            }),
            table,
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const storageId = await ctx.storage.store(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    );
    const url = await ctx.storage.getUrl(storageId);

    if (!url) {
      throw new Error("Failed to generate DOCX download URL");
    }

    return {
      url,
      storageId,
      fileName: `${(documentRecord.title || "turathly-export").replace(/[^\w-]+/g, "-")}.docx`,
    };
  },
});
