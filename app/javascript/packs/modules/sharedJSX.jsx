import React from 'react';

export function renderPendingDots (block, element, label) {
  const rootClasses = `${block}__${element} ${block}__${element}--pending`;
  const dotClass = `${block}__loading-dot`;
  return (
    <p key="dotContainer" className={rootClasses} aria-label={label}>
      <span className={dotClass} aria-hidden="true">.</span>
      <span className={dotClass} aria-hidden="true">.</span>
      <span className={dotClass} aria-hidden="true">.</span>
    </p>
  );
}