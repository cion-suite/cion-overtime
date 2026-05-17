import { useState } from 'react';

import { useT } from '@/shared/i18n';
import { useOvertime } from '@/shared/lib/overtime/context';
import { parseDur, todayISO } from '@/shared/lib/time';
import { toast } from '@/shared/lib/toast';
import { Button } from '@/shared/ui/shadcn/button';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/shadcn/field';
import { Input } from '@/shared/ui/shadcn/input';
import { CAPTION_LABEL_CLS } from '@/shared/ui/caption-label';

interface ManualDeductFormProps {
    entryId: string;
    onAfterSubmit?: () => void;
}

export function ManualDeductForm({ entryId, onAfterSubmit }: ManualDeductFormProps) {
    const t = useT();
    const { addDeduction } = useOvertime();
    const [dur, setDur] = useState('');
    const [date, setDate] = useState(todayISO);

    function handleSubmit() {
        const minutes = parseDur(dur);
        if (minutes == null || minutes <= 0) {
            toast.error(t('overtime.manualDeduct.invalidDuration'));
            return;
        }
        addDeduction(entryId, date || todayISO(), minutes);
        setDur('');
        onAfterSubmit?.();
    }

    return (
        <FieldGroup>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                <Field>
                    <FieldLabel htmlFor={`ded-dur-${entryId}`} className={CAPTION_LABEL_CLS}>
                        {t('overtime.manualDeduct.duration')}
                    </FieldLabel>
                    <Input
                        id={`ded-dur-${entryId}`}
                        placeholder="01:00"
                        pattern="^\d{1,3}:[0-5]\d$"
                        value={dur}
                        onChange={(e) => setDur(e.target.value)}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`ded-date-${entryId}`} className={CAPTION_LABEL_CLS}>
                        {t('overtime.manualDeduct.date')}
                    </FieldLabel>
                    <Input
                        id={`ded-date-${entryId}`}
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </Field>
                <Button type="button" variant="outline" onClick={handleSubmit}>
                    {t('overtime.manualDeduct.submit')}
                </Button>
            </div>
        </FieldGroup>
    );
}
