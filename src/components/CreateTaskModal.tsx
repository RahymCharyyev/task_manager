import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import type { TaskPriority } from '../types/task';
import { TASK_PRIORITY_OPTIONS } from '../constants';

type CreateTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    priority: TaskPriority;
    assignee: string;
  }) => Promise<void>;
  submitting?: boolean;
};

type FormValues = {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
};

export function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  submitting,
}: CreateTaskModalProps) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  async function handleOk() {
    const values = await form.validateFields();
    await onSubmit(values);
    form.resetFields();
  }

  return (
    <Modal
      title={
        <span className='font-heading text-xl font-semibold gradient-text tracking-tight'>
          Create Task
        </span>
      }
      open={open}
      onCancel={() => {
        if (!submitting) onClose();
      }}
      okText='Create Task'
      cancelText='Cancel'
      confirmLoading={submitting}
      onOk={() => handleOk()}
      destroyOnHidden
      centered
      wrapClassName='overscroll-behavior-contain'
      classNames={{
        mask: '!backdrop-blur-[3px]',
        container:
          '!rounded-2xl !shadow-2xl shadow-slate-900/25 dark:!shadow-black/60',
      }}
    >
      <Form<FormValues>
        form={form}
        layout='vertical'
        requiredMark={false}
        initialValues={{
          title: '',
          description: '',
          priority: 'MEDIUM',
          assignee: '',
        }}
      >
        <Form.Item
          label='Title'
          name='title'
          rules={[{ required: true, message: 'Enter a title.' }]}
        >
          <Input placeholder='Short summary…' />
        </Form.Item>
        <Form.Item
          label='Description'
          name='description'
          rules={[{ required: true, message: 'Enter a description.' }]}
        >
          <Input.TextArea rows={3} placeholder='Details for your team…' />
        </Form.Item>
        <Form.Item label='Priority' name='priority'>
          <Select options={TASK_PRIORITY_OPTIONS} />
        </Form.Item>
        <Form.Item
          label='Assignee'
          name='assignee'
          rules={[{ required: true, message: 'Enter an assignee.' }]}
        >
          <Input placeholder='Name or handle…' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
