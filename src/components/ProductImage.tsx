import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

export default function ProductImage({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState<string>();
  const { t } = useTranslation();
  return src && failed !== src ? <img {...props} src={src} alt={alt ?? ''} onError={() => setFailed(src)} />
    : <div role="img" aria-label={alt || t('catalog.noImage')} className={props.className}>
      <span className="block p-6 text-center text-gray-500">{t('catalog.noImage')}</span>
    </div>;
}
