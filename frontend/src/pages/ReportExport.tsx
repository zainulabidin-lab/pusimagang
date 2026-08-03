import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Printer, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const ReportExport: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                // Fetch user data, evaluations, logbooks, and tasks
                // This requires a custom endpoint or multiple endpoints.
                // For V1.2, we'll fetch from existing endpoints and filter.
                
                // Assuming we use existing endpoints, we would fetch evaluations and logbooks,
                // but we need them specifically for this intern_id.
                // Ideally, a specific endpoint like `/reports/intern/{id}` is better.
                // Since we don't have it, we will fetch evaluations and logbooks and filter locally (assuming admin/mentor).
                
                const [evalRes, logbookRes, tasksRes] = await Promise.all([
                    api.get('/evaluations'),
                    api.get('/logbook'), // Warning: logbook endpoint returns all if admin, or intern's if intern. We need admin rights to see all.
                    api.get('/tasks')
                ]);

                const internEval = evalRes.data.data.find((e: any) => e.intern_id === Number(id));
                const internLogbooks = logbookRes.data.data.filter((l: any) => l.intern_id === Number(id));
                const internTasks = tasksRes.data.data.filter((t: any) => t.intern_id === Number(id) && t.status === 'done');

                setData({
                    evaluation: internEval,
                    logbooks: internLogbooks,
                    tasks: internTasks
                });
            } catch (error) {
                console.error("Failed to fetch report", error);
                alert("Gagal mengambil data laporan. Pastikan Anda memiliki akses.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <LoadingSpinner message="Menyiapkan laporan..." />;

    if (!data?.evaluation) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h3>Laporan belum bisa dicetak karena anak magang ini belum diberikan Penilaian Akhir oleh Mentor.</h3>
                <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginTop: '1rem' }}>Kembali</button>
            </div>
        );
    }

    const ev = data.evaluation;

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '2rem' }}>
            {/* Action Bar (Hidden in Print) */}
            <div className="print-hide" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <ArrowLeft size={16} /> Kembali
                </button>
                <button onClick={handlePrint} className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Printer size={16} /> Cetak PDF (A4)
                </button>
            </div>

            {/* A4 Printable Area */}
            <div className="print-area" style={{ maxWidth: '210mm', margin: '0 auto', color: '#000', fontFamily: 'serif' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '3px double #000', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '100px', flexShrink: 0, textAlign: 'center' }}>
                        <img src="/logo-unmer.png" alt="Logo UNMER Malang" style={{ width: '80px', height: 'auto' }} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', textTransform: 'uppercase', color: '#000' }}>UNIVERSITAS MERDEKA MALANG</h1>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.25rem 0', textTransform: 'uppercase' }}>PUSAT TEKNOLOGI DAN SISTEM INFORMASI</h2>
                        <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0', fontWeight: 600, letterSpacing: '0.05em' }}>LAPORAN EVALUASI AKHIR KINERJA MAGANG</p>
                    </div>
                    <div style={{ width: '100px', flexShrink: 0 }}></div>
                </div>

                {/* Identitas */}
                <div style={{ marginBottom: '2rem' }}>
                    <table style={{ width: '100%', fontSize: '1rem', lineHeight: 1.5 }}>
                        <tbody>
                            <tr>
                                <td style={{ width: '150px', fontWeight: 600 }}>Nama Siswa</td>
                                <td style={{ width: '10px' }}>:</td>
                                <td>{ev.intern?.name}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>Asal Instansi</td>
                                <td>:</td>
                                <td>{ev.intern?.intern_profile?.school?.name || '-'}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>Mentor Pembimbing</td>
                                <td>:</td>
                                <td>{ev.mentor?.name}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 600 }}>Tanggal Evaluasi</td>
                                <td>:</td>
                                <td>{new Date(ev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Nilai Evaluasi */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, borderBottom: '1px solid #000', paddingBottom: '0.25rem', marginBottom: '1rem' }}>A. HASIL EVALUASI MENTOR</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', width: '50px' }}>No</th>
                                <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left' }}>Komponen Penilaian</th>
                                <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center', width: '100px' }}>Nilai (0-100)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>1</td>
                                <td style={{ border: '1px solid #000', padding: '0.5rem' }}>Kemampuan Teknis (Technical Skill)</td>
                                <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>{ev.technical_score}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>2</td>
                                <td style={{ border: '1px solid #000', padding: '0.5rem' }}>Komunikasi & Kerjasama (Communication)</td>
                                <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>{ev.communication_score}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>3</td>
                                <td style={{ border: '1px solid #000', padding: '0.5rem' }}>Disiplin & Tanggung Jawab (Discipline)</td>
                                <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>{ev.discipline_score}</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>4</td>
                                <td style={{ border: '1px solid #000', padding: '0.5rem' }}>Pemecahan Masalah (Problem Solving)</td>
                                <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>{ev.problem_solving_score}</td>
                            </tr>
                            <tr style={{ fontWeight: 700 }}>
                                <td colSpan={2} style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'right' }}>RATA-RATA NILAI & PREDIKAT AKHIR</td>
                                <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>{ev.final_grade}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, borderBottom: '1px solid #000', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>B. CATATAN MENTOR</h3>
                    <p style={{ fontSize: '1rem', lineHeight: 1.5, minHeight: '50px' }}>
                        {ev.notes || '-'}
                    </p>
                </div>

                {/* Ringkasan Portofolio */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, borderBottom: '1px solid #000', paddingBottom: '0.25rem', marginBottom: '1rem' }}>C. RINGKASAN PORTOFOLIO TUGAS</h3>
                    <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Total Tugas Terselesaikan (Done): <b>{data.tasks.length} Tugas</b></p>
                    <p style={{ fontSize: '1rem' }}>Total Kehadiran/Logbook Harian: <b>{data.logbooks.length} Hari</b></p>
                </div>

                {/* Detail Logbook Harian */}
                <div style={{ marginBottom: '3rem', pageBreakInside: 'auto' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, borderBottom: '1px solid #000', paddingBottom: '0.25rem', marginBottom: '1rem' }}>D. REKAPITULASI KEGIATAN HARIAN</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f3f4f6' }}>
                                <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left', width: '90px' }}>Tanggal</th>
                                <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'left' }}>Aktivitas & Hasil</th>
                                <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center', width: '100px' }}>Foto</th>
                                <th style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center', width: '80px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.logbooks.map((log: any, index: number) => (
                                <tr key={log.id} style={{ pageBreakInside: 'avoid' }}>
                                    <td style={{ border: '1px solid #000', padding: '0.5rem', verticalAlign: 'top' }}>
                                        {new Date(log.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}<br/>
                                        <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>{log.start_time?.substring(0,5)} - {log.end_time?.substring(0,5)}</span>
                                    </td>
                                    <td style={{ border: '1px solid #000', padding: '0.5rem', verticalAlign: 'top' }}>
                                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{log.activity}</div>
                                        {log.result && <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}><b>Hasil:</b> {log.result}</div>}
                                        {log.mentor_notes && <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: '#1d4ed8' }}><b>Catatan Mentor:</b> {log.mentor_notes}</div>}
                                    </td>
                                    <td style={{ border: '1px solid #000', padding: '0.5rem', verticalAlign: 'top', textAlign: 'center' }}>
                                        {log.documentation_path ? (
                                            <img src={log.documentation_path} alt="Dokumentasi" style={{ width: '80px', height: '60px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                                        ) : (
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ border: '1px solid #000', padding: '0.5rem', verticalAlign: 'top', textAlign: 'center', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}>
                                        {log.status === 'approved' ? 'Disetujui' : (log.status === 'rejected' ? 'Ditolak' : 'Pending')}
                                    </td>
                                </tr>
                            ))}
                            {data.logbooks.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ border: '1px solid #000', padding: '1rem', textAlign: 'center' }}>Tidak ada data kegiatan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tanda Tangan */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4rem' }}>
                    <div style={{ width: '250px', textAlign: 'center' }}>
                        <p style={{ fontSize: '1rem', margin: '0 0 4rem 0' }}>Malang, {new Date(ev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p style={{ fontSize: '1rem', fontWeight: 700, textDecoration: 'underline', margin: '0 0 0.25rem 0' }}>{ev.mentor?.name}</p>
                        <p style={{ fontSize: '0.875rem', margin: 0 }}>Mentor Pembimbing Magang</p>
                    </div>
                </div>

            </div>
            
            {/* CSS specifically for printing */}
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-area, .print-area * {
                        visibility: visible;
                    }
                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .print-hide {
                        display: none !important;
                    }
                }
                `}
            </style>
        </div>
    );
};

export default ReportExport;
