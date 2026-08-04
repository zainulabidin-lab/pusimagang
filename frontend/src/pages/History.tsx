import React from 'react';
import { History as HistoryIcon } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

const History: React.FC = () => {
    return (
        <div style={{ padding: '4rem 2rem' }}>
            <EmptyState 
                icon={<HistoryIcon size={48} />}
                title="Riwayat Aktivitas"
                description="Fitur riwayat aktivitas sedang dalam tahap pengembangan (Coming Soon)."
            />
        </div>
    );
};

export default History;
