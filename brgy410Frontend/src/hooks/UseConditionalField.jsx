import { useState } from 'react';

export function useConditionalField(mainValue, triggerValue) {
  const [conditionalValue, setConditionalValue] = useState('');
  
  const getFinalValue = () => {
    return mainValue === triggerValue ? conditionalValue : mainValue;
  };
  
  const shouldShow = mainValue === triggerValue;
  
  const reset = () => setConditionalValue('');
  
  return {
    conditionalValue,
    setConditionalValue,
    getFinalValue,
    shouldShow,
    reset
  };
}