import { useEffect } from 'react';

import { OvertimeBoard } from '@/widgets/overtime-board';

export function HomePage() {
    useEffect(() => {
        window.app?.signalReady();
    }, []);

    return <OvertimeBoard />;
}
