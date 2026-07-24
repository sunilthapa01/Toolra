import { useState, useCallback, ChangeEvent } from 'react';

export type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K], values: T) => string | null;
};

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      
      if (validationRules && validationRules[name]) {
        // Validate with the updated value
        const rule = validationRules[name];
        if (rule) {
          const error = rule(value, { ...values, [name]: value });
          setErrors((prev) => ({ ...prev, [name]: error || '' }));
        }
      }
    },
    [validationRules, values]
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      let parsedValue: any = value;
      
      if (type === 'number') {
        parsedValue = value === '' ? '' : parseFloat(value);
      } else if (type === 'checkbox') {
        parsedValue = (e.target as HTMLInputElement).checked;
      }
      
      handleChange(name as keyof T, parsedValue);
    },
    [handleChange]
  );

  const validate = useCallback(() => {
    if (!validationRules) return true;
    
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const rule = validationRules[key as keyof T];
      if (rule) {
        const error = rule(values[key as keyof T], values);
        if (error) {
          newErrors[key as keyof T] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleInputChange,
    validate,
    reset,
    setValues,
    setErrors,
  };
}
