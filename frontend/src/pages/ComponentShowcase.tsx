import React, { useState } from 'react';
import { Button, SplitButton } from '../components/ui/Button';
import { Input, TagInput, OtpInput } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Dropdown } from '../components/ui/Dropdown';
import { Checkbox } from '../components/ui/Checkbox';
import { Radio } from '../components/ui/Radio';
import { Switch } from '../components/ui/Switch';
import { FileUpload } from '../components/ui/FileUpload';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Drawer } from '../components/ui/Drawer';
import { Tooltip } from '../components/ui/Tooltip';
import { ToastContainer, type ToastProps } from '../components/ui/Toast';
import { Skeleton, SkeletonCard, SkeletonForm } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { LinearProgress, CircularProgress, StepProgress } from '../components/ui/Progress';
import { Timeline } from '../components/ui/Timeline';
import { Calendar } from '../components/ui/Calendar';
import { FilterBar } from '../components/ui/FilterBar';
import { LineChart, BarChart, DonutChart } from '../components/ui/Chart';
import { Check, Mail, Lock, Plus, Settings } from 'lucide-react';

const ComponentShowcase: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [tags, setTags] = useState(['React', 'TypeScript']);
  const [otp, setOtp] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [dropdownVal, setDropdownVal] = useState<string[]>(['1']);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    const newToast: ToastProps = {
      id: Date.now().toString(),
      title: `Sample ${type} toast`,
      message: 'This is a description of the toast notification.',
      type,
      onClose: (id) => setToasts(t => t.filter(x => x.id !== id))
    };
    setToasts([...toasts, newToast]);
  };

  const chartData = [
    { name: 'Jan', pv: 2400, uv: 4000 },
    { name: 'Feb', pv: 1398, uv: 3000 },
    { name: 'Mar', pv: 9800, uv: 2000 },
  ];

  return (
    <div style={{ padding: 'var(--space-32)', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-48)' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-8)' }}>Enterprise UI Kit</h1>
        <p style={{ color: 'var(--text-muted)' }}>Showcase of all Phase 3 reusable components.</p>
      </div>

      {/* Buttons */}
      <section>
        <h2>1. Buttons</h2>
        <div style={{ display: 'flex', gap: 'var(--space-16)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success" leftIcon={<Check size={16} />}>Success Icon</Button>
          <Button isLoading>Loading</Button>
          <Button variant="outline" isDropdown>Dropdown</Button>
          <SplitButton mainAction="Split Button" mainOnClick={() => {}} dropdownOptions={[{ label: 'Option 1', onClick: () => {} }]} />
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2>2. Inputs & Forms</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-24)' }}>
          <Input label="Standard Input" placeholder="Type here..." leftIcon={<Mail size={16} />} />
          <Input floatingLabel label="Floating Label" placeholder="Type here..." leftIcon={<Lock size={16} />} />
          <Input label="Error State" error helperText="This field is required." />
          <Select label="Native Select" options={[{ value: '1', label: 'Option 1' }]} />
          <Dropdown label="Multi Select Dropdown" multiple value={dropdownVal} onChange={setDropdownVal} options={[{ value: '1', label: 'React' }, { value: '2', label: 'Vue' }]} />
          <TagInput label="Tag Input" tags={tags} onChange={setTags} />
        </div>
        <div style={{ marginTop: 'var(--space-24)' }}>
          <label className="ds-input-label">OTP Input</label>
          <OtpInput value={otp} onChange={setOtp} />
        </div>
      </section>

      {/* Toggles */}
      <section>
        <h2>3. Toggles & Uploads</h2>
        <div style={{ display: 'flex', gap: 'var(--space-32)', marginBottom: 'var(--space-24)' }}>
          <Checkbox label="Remember me" description="Save login details" />
          <Radio label="Option A" name="radio-group" />
          <Switch label="Enable Notifications" />
        </div>
        <FileUpload label="Document Upload" multiple value={files} onChange={setFiles} />
      </section>

      {/* Badges & Progress */}
      <section>
        <h2>4. Badges & Progress</h2>
        <div style={{ display: 'flex', gap: 'var(--space-16)', marginBottom: 'var(--space-24)' }}>
          <Badge variant="pending" dot>Pending</Badge>
          <Badge variant="approved" dot>Approved</Badge>
          <Badge variant="rejected" dot>Rejected</Badge>
          <Badge variant="new">New</Badge>
          <Badge variant="default">Draft</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-32)', alignItems: 'center' }}>
          <div>
            <LinearProgress value={65} label="Task Progress" showValue />
            <br/>
            <LinearProgress indeterminate color="warning" />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-16)' }}>
            <CircularProgress value={75} showValue />
            <CircularProgress value={45} color="danger" showValue />
          </div>
        </div>
        <div style={{ marginTop: 'var(--space-32)' }}>
          <StepProgress steps={[
            { label: 'Step 1', status: 'complete' },
            { label: 'Step 2', status: 'current', description: 'In progress' },
            { label: 'Step 3', status: 'upcoming' },
          ]} />
        </div>
      </section>

      {/* Cards & Tables */}
      <section>
        <h2>5. Cards & Tables</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-24)', marginBottom: 'var(--space-24)' }}>
          <Card hoverable>
            <CardHeader>
              <CardTitle>Standard Card</CardTitle>
              <CardDescription>Hover over me for an effect.</CardDescription>
            </CardHeader>
            <CardContent>Content goes here.</CardContent>
            <CardFooter><Button variant="outline" size="sm">Action</Button></CardFooter>
          </Card>
          <Card variant="statistic">
            <CardTitle>Total Students</CardTitle>
            <CardContent>1,248</CardContent>
          </Card>
          <Card variant="announcement">
            <CardHeader>
              <CardTitle>System Update</CardTitle>
            </CardHeader>
            <CardContent>New features have been released.</CardContent>
          </Card>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell><Badge variant="approved">Active</Badge></TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell><Badge variant="pending">Pending</Badge></TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* Skeletons & Empty States */}
      <section>
        <h2>6. Loaders & States</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-24)', marginBottom: 'var(--space-24)' }}>
          <SkeletonCard />
          <SkeletonForm />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-24)' }}>
          <EmptyState variant="card" title="No data available" description="You haven't created any items yet." primaryAction={<Button leftIcon={<Plus size={16}/>}>Create Item</Button>} />
          <ErrorState variant="card" type="404" />
        </div>
      </section>

      {/* Feedback & Overlays */}
      <section>
        <h2>7. Feedback & Overlays</h2>
        <div style={{ display: 'flex', gap: 'var(--space-16)', alignItems: 'center', marginBottom: 'var(--space-24)' }}>
          <Button onClick={() => addToast('success')}>Success Toast</Button>
          <Button onClick={() => addToast('error')}>Error Toast</Button>
          <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
          <Tooltip content="This is a premium tooltip!" position="top">
            <Button variant="ghost">Hover me</Button>
          </Tooltip>
        </div>
      </section>

      {/* Advanced (Charts & Calendar) */}
      <section>
        <h2>8. Advanced (Charts, Calendar, Timeline)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-24)', marginBottom: 'var(--space-24)' }}>
          <Card>
            <CardHeader><CardTitle>Line Chart</CardTitle></CardHeader>
            <CardContent><LineChart data={chartData} lines={[{ dataKey: 'pv' }, { dataKey: 'uv' }]} height={200} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Donut Chart</CardTitle></CardHeader>
            <CardContent><DonutChart data={chartData} dataKey="pv" height={200} /></CardContent>
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--space-48)', alignItems: 'flex-start' }}>
          <Calendar />
          <Timeline items={[
            { title: 'Project Created', description: 'By Admin', time: '10:00 AM', status: 'success' },
            { title: 'Review Pending', description: 'Waiting for mentor approval', time: '11:30 AM', status: 'warning' },
            { title: 'System Error', description: 'Failed to deploy', time: '1:00 PM', status: 'danger' },
          ]} />
        </div>
      </section>

      <FilterBar title="Active Filters" activeFiltersCount={2} onClearFilters={() => {}}>
        <Select options={[{value: 'all', label: 'All Departments'}]} />
        <Input placeholder="Search..." />
      </FilterBar>

      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Drawer Panel" description="This is a reusable slide-out drawer component.">
        <p>You can put forms or details here.</p>
      </Drawer>

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default ComponentShowcase;
