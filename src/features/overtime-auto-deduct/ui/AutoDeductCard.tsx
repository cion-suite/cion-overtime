import { useState } from 'react';

import { useT } from '@/shared/i18n';
import { useOvertime } from '@/shared/lib/overtime/context';
import { useThreshold } from '@/shared/lib/threshold';
import { parseDur, todayISO } from '@/shared/lib/time';
import { toast } from '@/shared/lib/toast';
import { Button } from '@/shared/ui/shadcn/button';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from '@/shared/ui/shadcn/field';
import { Input } from '@/shared/ui/shadcn/input';
import { Panel } from '@/shared/ui/panel';
import { CAPTION_LABEL_CLS } from '@/shared/ui/caption-label';

import { AutoDeductResultDialog } from './AutoDeductResultDialog.js';
import type { AutoDeductDialogState } from './AutoDeductResultDialog.js';
import { ThresholdEditor } from './ThresholdEditor.js';

export function AutoDeductCard() {
    const t = useT();
    const { autoDeduct } = useOvertime();
    const { threshold } = useThreshold();
    const [dur, setDur] = useState('');
    const [date, setDate] = useState(todayISO);
    const [dialog, setDialog] = useState<AutoDeductDialogState | null>(null);

    function handleSubmit() {
        const minutes = parseDur(dur);
        if (minutes == null || minutes <= 0) {
            toast.error(t('overtime.autoDeduct.invalidDuration'));
            return;
        }
        const targetDate = date || todayISO();
        const r = autoDeduct(minutes, targetDate);
        if (r.taken === 0) {
            toast.error(t('overtime.autoDeduct.noEligible', { threshold }));
            return;
        }
        setDur('');
        setDialog({ requested: minutes, taken: r.taken, breakdown: r.breakdown });
    }

    return (
        <>
            <Panel>
                <FieldGroup>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                        <Field>
                            <FieldLabel htmlFor="auto-dur" className={CAPTION_LABEL_CLS}>
                                {t('overtime.autoDeduct.duration')}
                            </FieldLabel>
                            <Input
                                id="auto-dur"
                                placeholder="02:00"
                                pattern="^\d{1,3}:[0-5]\d$"
                                value={dur}
                                onChange={(e) => setDur(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="auto-date" className={CAPTION_LABEL_CLS}>
                                {t('overtime.autoDeduct.date')}
                            </FieldLabel>
                            <Input
                                id="auto-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Field>
                        <Button type="button" variant="default" onClick={handleSubmit}>
                            {t('overtime.autoDeduct.submit')}
                        </Button>
                    </div>
                    <FieldDescription className="text-xs">
                        {t('overtime.autoDeduct.hintPrefix')}
                        <ThresholdEditor />
                        {t('overtime.autoDeduct.hintSuffix')}
                    </FieldDescription>
                </FieldGroup>
            </Panel>
            <AutoDeductResultDialog
                state={dialog}
                onOpenChange={(open) => !open && setDialog(null)}
            />
        </>
    );
}
