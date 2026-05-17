import { z } from 'zod';

const deductionSchema = z.object({
    id: z.string(),
    date: z.string(),
    minutes: z.number(),
    note: z.string().default(''),
    createdAt: z.number(),
});

const overtimeEntrySchema = z.object({
    id: z.string(),
    type: z.literal('overtime'),
    date: z.string(),
    start: z.string(),
    end: z.string(),
    minutes: z.number(),
    note: z.string().default(''),
    createdAt: z.number(),
    deductions: z.array(deductionSchema).default([]),
});

const autoLogBreakdownSchema = z.object({
    sourceDate: z.string(),
    minutes: z.number(),
});

const autoLogEntrySchema = z.object({
    id: z.string(),
    date: z.string(),
    createdAt: z.number(),
    taken: z.number(),
    breakdown: z.array(autoLogBreakdownSchema).default([]),
});

export const overtimeSnapshotSchema = z.object({
    version: z.number().default(2),
    savedAt: z.string().default(''),
    entries: z.array(overtimeEntrySchema).default([]),
    autoLog: z.array(autoLogEntrySchema).default([]),
});

export const overtimeStoreSchema = z.object({
    snapshot: overtimeSnapshotSchema.default({
        version: 2,
        savedAt: '',
        entries: [],
        autoLog: [],
    }),
});
