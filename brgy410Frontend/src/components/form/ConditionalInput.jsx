import TextInput from '../common/TextInput';

export default function ConditionalInput({ 
  show, 
  label, 
  name, 
  value, 
  onChange, 
  placeholder,
  required = false,
  className = "",
  labelClassName = "",
  containerClassName = ""
}) {
  if (!show) return null;
  
  return (
    <TextInput
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={className}
      labelClassName={labelClassName}
      containerClassName={containerClassName}
    />
  );
}
