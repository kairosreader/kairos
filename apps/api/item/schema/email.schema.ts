import { z } from "@hono/zod-openapi";
import { urlSchema } from "@api/common/schema/url.schema.ts";
import { baseItemFields } from "./item.schema.ts";
import { ITEM_TYPE } from "@shared/constants/mod.ts";

export const EmailAttachmentSchema = z.object({
  name: z.string(),
  url: urlSchema,
});

export const EmailContentSchema = z
  .object({
    from: z.string().email(),
    to: z.array(z.string().email()),
    subject: z.string(),
    content: z.string(),
    attachments: z.array(EmailAttachmentSchema).optional(),
  })
  .openapi("EmailContent");

export const EmailSchema = z.object({
  ...baseItemFields,
  type: z.literal(ITEM_TYPE.EMAIL),
  content: EmailContentSchema,
});

export const CreateEmailRequestSchema = z.object({
  type: z.literal(ITEM_TYPE.EMAIL),
  content: EmailContentSchema,
});

export const UpdateEmailContentSchema = z.object({
  type: z.literal(ITEM_TYPE.EMAIL),
  content: EmailContentSchema.partial(),
});
