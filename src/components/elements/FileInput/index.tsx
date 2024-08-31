import { useState, ReactNode } from "react";
import { FileInputProps } from "./interface";
import { AiFillFileImage } from "react-icons/ai";
import { MdCloudUpload, MdDelete } from "react-icons/md";

export const FileInput = ({
  secondaryMessage,
  alternateInput,
  onDrop,
  onReset,
  fileId,
  success,
  textClassName = "text-blue-600 font-semibold",
  ...rest
}: FileInputProps) => {
  const [isSuccess, setIsSuccess] = useState(success || false);
  const [filename, setFilename] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFilename(file.name);
      onDrop(Array.from(files));
      setIsSuccess(true);
    }
  };

  const handleReset = () => {
    onReset();
    setIsSuccess(false);
    setFilename(null);
  };

  return (
    <div className="flex flex-col text-white">
      {isSuccess ? (
        <div className="relative flex flex-col justify-center items-center border-2 border-solid border-[#6d00f9] h-[300px] w-[500px] bg-[#6d00f9] rounded-md">
          <div className="flex flex-col items-center pointer-events-none">
            <AiFillFileImage color="#ffffff" size={60} />
            <p className="text-white mt-2">Resume ready to be processed</p>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col justify-center items-center border-2 border-dashed border-[#1475cf] h-[300px] w-[500px] cursor-pointer rounded-md">
          <input
            type="file"
            id={fileId}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            {...rest}
          />
          <div className="flex flex-col items-center pointer-events-none">
            <MdCloudUpload color="#6d00f9" size={60} />
            <p className={textClassName}>{secondaryMessage}</p>
          </div>
        </div>
      )}

      {isSuccess && (
        <section className="flex justify-between items-center mt-4 p-4 rounded-md bg-[#e9f0ff] w-full max-w-[500px]">
          <AiFillFileImage color="#6d00f9" size={25} />
          <div className="flex items-center space-x-2 text-primary">
            <span>{filename}</span>
            <MdDelete
              className="text-primary cursor-pointer"
              size={25}
              onClick={handleReset}
            />
          </div>
        </section>
      )}
    </div>
  );
};
