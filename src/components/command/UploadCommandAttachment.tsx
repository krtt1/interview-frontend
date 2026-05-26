type Props = {
  onChange: (file: File | null) => void;
};

const UploadCommandAttachment: React.FC<Props> = ({ onChange }) => {
  return (
    <input
      type="file"
      onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      className="border p-2 rounded w-full text-sm"
    />
  );
};

export default UploadCommandAttachment;
