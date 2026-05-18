import { useState } from 'react';

import { useT } from '@/shared/i18n';
import { useThreshold } from '@/shared/lib/threshold';
import { toast } from '@/shared/lib/toast';
import { parsePositiveInt } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/shadcn/button';
import {
    Field,
    FieldGroup,
    FieldLabel,
} from '@/shared/ui/shadcn/field';
import { Input } from '@/shared/ui/shadcn/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/shared/ui/shadcn/popover';

export function ThresholdEditor() {
    const t = useT();
    const { threshold, setThreshold } = useThreshold();
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(String(threshold));

    function handleOpenChange(next: boolean) {
        if (next) setDraft(String(threshold));
        setOpen(next);
    }

    function handleApply() {
        const n = parsePositiveInt(draft);
        if (n == null) {
            toast.error(t('overtime.threshold.invalid'));
            return;
        }
        setThreshold(n);
        setOpen(false);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleApply();
        }
    }

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="font-bold text-sm underline underline-offset-2 tabular-nums hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                    aria-label={t('overtime.threshold.editAria')}
                >
                    {threshold}
                </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-60">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="threshold-input">
                            {t('overtime.threshold.popoverTitle')}
                        </FieldLabel>
                        <Input
                            id="threshold-input"
                            type="number"
                            min={1}
                            step={1}
                            inputMode="numeric"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </Field>
                    <Button type="button" size="sm" onClick={handleApply}>
                        {t('overtime.threshold.apply')}
                    </Button>
                </FieldGroup>
            </PopoverContent>
        </Popover>
    );
}
