import { JSX } from 'react';

type Props = {
  withName?: boolean;
  forceDark?: boolean;
}

export const Logo = ({ withName = false, forceDark = false }: Props): JSX.Element => {
  return (
    <div className='flex flex-row gap-1 items-center'>
      <div className={`w-4 h-4 bg-black dark:bg-white rounded-sm ${forceDark && 'bg-white'}`} />
      {withName && <p className={`text-base font-semibold ${forceDark && 'text-neutral-50'}`}>FinAssist</p>}
    </div>
  );
};

{/* <div
  className="w-4 h-4 bg-black dark:bg-white rounded-sm animate-spin transition duration-700"
  style={{ animationDuration: "3s" }}
/> */}