import * as React from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (_value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, defaultValue, ...props }, ref) => {
      return (
        <RPNInput.default
          ref={ref}
          className={cn('flex', className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          defaultValue={defaultValue}
          onChange={(value) => {
            if (value) {
              onChange?.(value);
            }
          }}
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, defaultValue, ...props }, ref) => (
    <Input
      className={cn('rounded-e-lg rounded-s-none', className)}
      defaultValue={defaultValue} // Adiciona o valor default aqui
      {...props}
      ref={ref}
    />
  ),
);
InputComponent.displayName = 'InputComponent';

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
};

const CountrySelect = ({
  disabled,
  value,
}: CountrySelectProps) => {
  return (
    <Button
      type="button"
      variant='ghost'
      className={cn('flex gap-1 rounded-e-none rounded-s-lg pl-3 pr-1 dark:text-neutral-50 text-neutral-950 border dark:border-neutral-700 border-neutral-300 border-r-0 relative z-0 overflow-hidden bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-default shadow-md')}
      disabled={disabled}
    >
      <FlagComponent country={value} countryName={value} />
    </Button>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="bg-transparent flex h-4 w-6 overflow-hidden">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = 'FlagComponent';

export { PhoneInput };