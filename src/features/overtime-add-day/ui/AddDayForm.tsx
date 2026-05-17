import { useState, type FormEvent } from 'react';

import { useT } from '@/shared/i18n';
import { useOvertime } from '@/shared/lib/overtime/context';
import { todayISO } from '@/shared/lib/time';
import { Button } from '@/shared/ui/shadcn/button';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/shadcn/field';
import { Input } from '@/shared/ui/shadcn/input';
import { Panel } from '@/shared/ui/panel';
import { CAPTION_LABEL_CLS } from '@/shared/ui/caption-label';

const DEFAULT_START = '17:30';
const DEFAULT_END = '21:00';

export function AddDayForm() {
    const t = useT();
    const { addOvertime } = useOvertime();
    const [date, setDate] = useState(todayISO);
    const [start, setStart] = useState(DEFAULT_START);
    const [end, setEnd] = useState(DEFAULT_END);

    function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        if (!date || !start || !end) return;
        addOvertime(date, start, end);
        setDate(todayISO());
        setStart(DEFAULT_START);
        setEnd(DEFAULT_END);
    }

    return (
        <Panel>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-end">
                        <Field>
                            <FieldLabel htmlFor="add-date" className={CAPTION_LABEL_CLS}>
                                {t('overtime.addForm.date')}
                            </FieldLabel>
                            <Input
                                id="add-date"
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="add-start" className={CAPTION_LABEL_CLS}>
                                {t('overtime.addForm.start')}
                            </FieldLabel>
                            <Input
                                id="add-start"
                                type="time"
                                required
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="add-end" className={CAPTION_LABEL_CLS}>
                                {t('overtime.addForm.end')}
                            </FieldLabel>
                            <Input
                                id="add-end"
                                type="time"
                                required
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                            />
                        </Field>
                        <Button type="submit" variant="default">
                            {t('overtime.addForm.submit')}
                        </Button>
                    </div>
                </FieldGroup>
            </form>
        </Panel>
    );
}
