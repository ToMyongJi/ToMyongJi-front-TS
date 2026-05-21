import Button from '@components/common/button';
import TextField from '@components/common/textfield';
import useMaintenanceStore from '@store/maintenance-store';
import { adminMutations } from '@apis/admin/admin-mutations';
import { useModal } from '@hooks/use-modal';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { cn } from '@libs/cn';

type DateTimeParts = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
};

const parseDateTime = (dateStr?: string): DateTimeParts => {
  if (!dateStr) return { year: String(new Date().getFullYear()), month: '', day: '', hour: '', minute: '' };
  const [date, time] = dateStr.split(' ');
  const [year, month, day] = date.split('-');
  const [hour, minute] = time.split(':');
  return { year, month, day, hour, minute };
};

const formatDateTime = ({ month, day, hour, minute }: DateTimeParts): string => {
  const year = new Date().getFullYear();
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

type TimeBoxProps = {
  label: string;
  value: DateTimeParts;
  onChange: (field: keyof Omit<DateTimeParts, 'year'>, value: string) => void;
};

const TimeBox = ({ label, value, onChange }: TimeBoxProps) => {
  return (
    <div className="flex gap-[1.6rem]">
      <p className="W_SB15 mt-4">{label}</p>
      <div className="flex-col gap-[0.8rem]">
        <div className="flex items-center gap-[1.6rem]">
          <div className="flex items-center gap-[0.8rem]">
            <TextField
              placeholder="00"
              className="w-[11.7rem]"
              value={value.month}
              onChange={(e) => onChange('month', e.target.value)}
            />
            <p className="W_SB15">월</p>
          </div>
          <div className="flex items-center gap-[0.8rem]">
            <TextField
              placeholder="00"
              className="w-[11.7rem]"
              value={value.day}
              onChange={(e) => onChange('day', e.target.value)}
            />
            <p className="W_SB15">일</p>
          </div>
        </div>
        <div className="flex items-center gap-[1.6rem]">
          <div className="flex items-center gap-[0.8rem]">
            <TextField
              placeholder="00"
              className="w-[11.7rem]"
              value={value.hour}
              onChange={(e) => onChange('hour', e.target.value)}
            />
            <p className="W_SB15">시</p>
          </div>
          <div className="flex items-center gap-[0.8rem]">
            <TextField
              placeholder="00"
              className="w-[11.7rem]"
              value={value.minute}
              onChange={(e) => onChange('minute', e.target.value)}
            />
            <p className="W_SB15">분</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SystemCheck = () => {
  const { isMaintenance, info } = useMaintenanceStore();
  const {alert} = useModal();

  const [start, setStart] = useState<DateTimeParts>(() => parseDateTime(isMaintenance ? info?.startTime : undefined));
  const [end, setEnd] = useState<DateTimeParts>(() => parseDateTime(isMaintenance ? info?.expectedEndTime : undefined));
  const [message, setMessage] = useState(isMaintenance ? (info?.message ?? '') : '');

  const isFormFilled =
    [start.month, start.day, start.hour, start.minute,
     end.month, end.day, end.hour, end.minute,
     ].every((v) => v !== '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isMaintenance && info) {
      setStart(parseDateTime(info.startTime));
      setEnd(parseDateTime(info.expectedEndTime));
      setMessage(info.message);
    }
  }, [isMaintenance, info]);

  const sendMaintenance = useMutation(adminMutations.setStatus());

  const handleStartChange = (field: keyof Omit<DateTimeParts, 'year'>, value: string) => {
    setStart((prev) => ({ ...prev, [field]: value }));
  };

  const handleEndChange = (field: keyof Omit<DateTimeParts, 'year'>, value: string) => {
    setEnd((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const past = formatDateToString(new Date(Date.now() - 60_000));
    setIsLoading(true);
    await sendMaintenance.mutateAsync({
      status: isMaintenance ? 'normal' : 'maintenance',
      message,
      startTime: isMaintenance ? past : formatDateTime(start),
      expectedEndTime: isMaintenance ? past : formatDateTime(end),
    });
    await alert({
      title: '점검',
      description: isMaintenance ? '점검 해제가 완료되었습니다.' : '점검 설정이 완료되었습니다.',
      confirmText: '확인',
    });
    window.location.reload();
  };

  return (
    <div className="mx-auto w-full max-w-[42rem]">
      <div className="mt-[4.2rem] mb-[10rem] flex-col gap-[1.8rem]">
        <p className="W_Title">점검 기간 설정</p>
        <div className={cn('flex-col gap-[3rem] rounded-[1rem] border-1 border-gray-20 px-[2.5rem] py-[3rem]', isMaintenance && "opacity-40")}>
          <TimeBox label="시작 일시" value={start} onChange={handleStartChange} />
          <TimeBox label="종료 일시" value={end} onChange={handleEndChange} />
          <div className="flex gap-[1.6rem]">
            <p className="W_SB15 mt-4">점검 내용</p>
            <textarea
              className="W_R15 h-[14rem] w-[29.4rem] resize-none rounded-[0.8rem] border-[1px] border-gray-20 bg-white px-[1.4rem] py-[0.8rem] outline-none transition-colors placeholder:text-gray-70 focus:border-primary"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Button
            size="regular"
            variant="primary"
            className="h-[4rem] w-[11rem]"
            onClick={handleSubmit}
            disabled={isLoading || (!isMaintenance && !isFormFilled)}
          >
            {isMaintenance ? "해제" : "점검 시작"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemCheck;
