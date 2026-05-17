import { useT } from '@/shared/i18n';
import { useOvertime } from '@/shared/lib/overtime/context';
import { Button } from '@/shared/ui/shadcn/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/shared/ui/shadcn/tooltip';

export function ImportExportActions() {
    const t = useT();
    const { exportToFile, importFromFile } = useOvertime();
    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void importFromFile()}
                    >
                        {t('overtime.actions.import')}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{t('overtime.actions.importTooltip')}</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void exportToFile()}
                    >
                        {t('overtime.actions.export')}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>{t('overtime.actions.exportTooltip')}</TooltipContent>
            </Tooltip>
        </>
    );
}
