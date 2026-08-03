'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getDraft, saveDraft, clearDraft } from '@/lib/storage/indexedDB';

export function useToolDraft(toolSlug: string, initialDefaultValue: string = '') {
  const [value, setValue] = useState<string>(initialDefaultValue);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load draft from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;
    getDraft(toolSlug).then((savedContent) => {
      if (isMounted) {
        if (savedContent !== null && savedContent !== undefined) {
          setValue(savedContent);
        }
        setIsLoaded(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [toolSlug]);

  // Save draft with debouncing
  const updateValue = useCallback(
    (newValue: string) => {
      setValue(newValue);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        saveDraft(toolSlug, newValue);
      }, 400); // 400ms debounce
    },
    [toolSlug]
  );

  const resetDraft = useCallback(() => {
    setValue(initialDefaultValue);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    clearDraft(toolSlug);
  }, [toolSlug, initialDefaultValue]);

  return {
    value,
    setValue: updateValue,
    resetDraft,
    isLoaded,
  };
}
